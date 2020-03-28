import { Resource } from './resource';

export class BrowserStorageHelper {

    /**
     * The browser's storage alias for tabs.
     * Generates storage name by combining static string with tab ID.
     * 
     * @param tabId identification number of the tab
     * @returns string
     */
    private static readonly tabAlias = (tabId: number) => `tab-${tabId}`;

    /**
     * Stores new resource in browser storage.
     * Every resource is stored per its hash-code.
     * Storage structure for the resources looks as following:
     * @example
     * { 
     *      "12eefwef3r45h": {"tabId": 1, "resourceHash": "12eefwef3r45h", ...},
     *      "24keg43jksd33": {"tabId": 1, "resourceHash": "24keg43jksd33", ...},
     *      ...
     * }
     * 
     * @param resource to be stored
     */
    public async store(resource: Resource): Promise<void> {
        return browser.storage.local
            // store new resources object in storage
            .set({ [resource.resourceHash]: resource })
            // upsert tab store info
            .then(() => this.upsertTabResources(resource.tabId, resource.resourceHash));
    }

    /**
     * Stores new resource hash in browser storage by tab ID.
     * And updates badge state of the browser tab.
     * Storage structure for the resources looks as following:
     * @example
     * { 
     *      "tab-1": ["12eefwef3r45h", ...],
     *      "tab-2": ["24keg43jksd33", ...],
     *      ...
     * }
     * 
     * @param tab ID where resource is assigned to
     * @param resHash be stored by tab ID
     */
    private async upsertTabResources(tab: number, resHash: string): Promise<void> {
        const alias = BrowserStorageHelper.tabAlias(tab);
        return browser.storage.local
            .get(alias) // get by alias from storage
            .then(storage => storage[alias]) // get all associated hashes
            // update hashes
            .then((hashes: string[]) => {
                // create new hashes array if doesn't exist 
                if (!hashes) { return [resHash]; }
                // if already included do nothing
                if (hashes.includes(resHash)) { return; }
                // otherwise add new one to all 
                hashes.push(resHash);
                return hashes;
            })
            // store hashes by tab alias
            .then((hashes: string[]) => {
                if (!hashes) { return; }
                browser.storage.local.set({ [alias]: hashes });
                return hashes.length;
            })
            // update tab's badge info
            .then((hashCount: number) => {
                if (!hashCount) { return; }
                this.setBadgeText(hashCount, tab)
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
        const alias = BrowserStorageHelper.tabAlias(tabId);
        return browser.storage.local
            .get(alias)
            .then(storage => storage[alias]) // get all associated hashes
            .then(hashes => hashes || [])
            .then((hashes: string[]) => {
                return browser.storage.local
                    .get(hashes)
                    .then(Object.values)
            });
    }

    /**
     * Returns resource by hash-code
     * 
     * @param hash code of the resource uniquely identifying the resource
     * @returns resource if found, or null
     */
    public async getByHash(hash: string): Promise<Resource> {
        return browser.storage.local
            .get(hash)
            .then(storage => storage[hash]);
    }

    /**
     * Deletes all resources stored for given tab
     * 
     * @param tabId identification number of the tab
     * @returns promise of void
     */
    public async deleteByTab(tabId: number): Promise<void> {
        return browser.storage.local.remove(BrowserStorageHelper.tabAlias(tabId));
    }

    /**
     * Triggers callback with updated list of resources for given tab
     * 
     * @param tabId identification number of browser tab 
     * @param callback function called when change is detected
     */
    public addChangeListener(tabId: number, callback: (resources: Resource[]) => void): void {
        browser.storage.onChanged.addListener((changes, areaName: string) => {
            const tabChanges = changes[BrowserStorageHelper.tabAlias(tabId)];
            if (tabChanges) {
                callback(tabChanges.newValue);
            }
        });
    }

    private async setBadgeText(resourceCount: number, tabId: number): Promise<void> {
        return browser.browserAction.setBadgeText(
            {
                text: String(resourceCount),
                tabId: tabId
            }
        );
    }
}
