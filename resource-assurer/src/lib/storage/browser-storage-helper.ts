import { Resource } from './resource';

export class BrowserStorageHelper {

    /**
     * The browser's storage alias for resources.
     * Generates storage name by combining static string with tab ID.
     * 
     * @param tabId identification number of the tab
     * @returns string
     *  */
    public static readonly resourceAlias = (tabId: number) => `resources-${tabId}`;

    /**
     * Stores new resource in browser storage.
     * Every resource is stored per tab ID.
     * Storage structure for the resources looks as following following:
     * @example
     * { 
     *   "resources-1": {
     *      "12eefwef3r45h": {"tabId": 1, "resourceHash": "12eefwef3r45h", ...},
     *      "24keg43jksd33": {"tabId": 1, "resourceHash": "24keg43jksd33", ...},
     *      ...
     *   },
     *   "resources-2": {
     *      "asj34j54h5hfn": {"tabId": 2, "resourceHash": "asj34j54h5hfn", ...},
     *      "kegtrkt35ky56": {"tabId": 2, "resourceHash": "kegtrkt35ky56", ...},
     *      ...
     *   },
     *    ...
     * }
     * 
     * @param resource to be stored
     */
    public store(resource: Resource): void {
        this.getStoredResources(resource.tabId)
            .then((resources) => {
                // set new resource value to resources
                resources[resource.resourceHash] = resource;
                // create new resources object
                const resourcesObj = {};
                resourcesObj[BrowserStorageHelper.resourceAlias(resource.tabId)] = resources;

                // TODO: Not effective. Resources being stored in parallel could be lost.
                browser.storage.local
                    // store new resources object in storage
                    .set(resourcesObj)
                    // post store actions
                    .then(() => this.postStore(resource));
            });
    }

    /**
     * Returns array of resources in browser storage
     * for given tab ID number
     * 
     * @param tabId identification number of the tab
     * @returns promise of resource array
     */
    public getByTab(tabId: number): Promise<Resource[]> {
        return this.getStoredResources(tabId)
            .then(resourceMap => Object.values(resourceMap));
    }

    /**
     * Returns resource by hash-code
     * 
     * @param tabId identification number of the tab
     * @param hash code of the resource uniquely identifying the resource
     * @returns resource, or null, if not found 
     */
    public getByHash(tabId: number, hash: string): Promise<Resource> {
        return this.getByTab(tabId)
            .then(resources => resources.find(res => res.resourceHash === hash));
    }

    /**
     * Deletes all resources stored for given tab
     * 
     * @param tabId identification number of the tab
     * @returns promise of void
     */
    public deleteByTab(tabId: number): Promise<void> {
        return browser.storage.local.remove(BrowserStorageHelper.resourceAlias(tabId));
    }

    /**
     * Triggers callback with updated list of resources for given tab
     * 
     * @param tabId identification number of browser tab 
     * @param callback function called when change is detected
     */
    public addChangeListener(tabId: number, callback: (resources: Resource[]) => void) {
        browser.storage.onChanged.addListener((changes, storageName: string) => {
            if (storageName === BrowserStorageHelper.resourceAlias(tabId)) {
                callback(changes.resources.newValue);
            }
        });
    }

    private getStoredResources(tabId: number): Promise<any> {
        return browser.storage.local
            .get(BrowserStorageHelper.resourceAlias(tabId))
            .then(storage => storage[BrowserStorageHelper.resourceAlias(tabId)])
            .then(storage => storage || {});
    }

    private setBadgeText(resourceCount: number, tabId: number) {
        browser.browserAction.setBadgeText(
            {
                text: String(resourceCount),
                tabId: tabId
            }
        );
    }

    private async postStore(resource: Resource): Promise<void> {
        this.getByTab(resource.tabId)
            .then(resources => this.setBadgeText(resources.length, resource.tabId));
    }
}
