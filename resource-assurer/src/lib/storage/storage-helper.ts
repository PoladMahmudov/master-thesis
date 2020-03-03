import { Resource } from './resource';

export class StorageHelper {

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
    public storeResource(resource: Resource): void {
        this.getStoredResource(resource.tabId)
            .then((resources) => {
                if (!resources) {
                    resources = {};
                }
                // set new resource value to resources
                resources[resource.resourceHash] = resource;
                // create new resources object
                const resourcesObj = {};
                resourcesObj[StorageHelper.resourceAlias(resource.tabId)] = resources;

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
    public getResources(tabId: number): Promise<Resource[]> {
        return this.getStoredResource(tabId)
            .then(resourceMap => Object.values(resourceMap));
    }

    /**
     * Deletes all resources stored for given tab
     * 
     * @param tabId identification number of the tab
     * @returns promise of void
     */
    public deleteResources(tabId: number): Promise<void> {
        return browser.storage.local.remove(StorageHelper.resourceAlias(tabId));
    }

    private getStoredResource(tabId: number): Promise<any> {
        return browser.storage.local
            .get(StorageHelper.resourceAlias(tabId))
            .then(storage => storage[StorageHelper.resourceAlias(tabId)]);
    }

    private setBadgeText(resourceCount: number, tabId: number) {
        browser.browserAction.setBadgeText(
            {
                text: String(resourceCount),
                tabId: tabId
            }
        );
    }

    private postStore(resource: Resource) {
        this.getResources(resource.tabId)
            .then(resources => this.setBadgeText(resources.length, resource.tabId));
    }
}
