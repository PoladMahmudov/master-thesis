import { Resource } from './resource';

export class StorageHelper {
    // resource browsers storage name
    // TODO: doc
    public static readonly RESOURCE_ALIAS = 'resources';

    // store new resource in browser storage
    public storeResource(resource: Resource) {
        this.getStoredResourceMap()
            .then((resources) => {
                // set new resource value to resources
                resources[resource.resourceHash] = resource;
                // create new resources object
                const resourcesObj = {};
                resourcesObj[StorageHelper.RESOURCE_ALIAS] = resources;
                
                browser.storage.sync
                    // store new resources object in storage
                    .set(resourcesObj)
                    // reset badge info
                    .then(() =>
                        this.getResourcesForTab(resource.tabId)
                            .then(resources => this.setBadgeText(() => resources.length, resource.tabId))
                    );
            });
    }

    // TODO: doc
    public getResources(): Promise<Resource[]> {
        return this.getStoredResourceMap()
            .then(resourceMap => Object.values(resourceMap));
    }

    // TODO: doc
    public getResourcesForTab(tabId: number): Promise<Resource[]> {
        return this.getResources()
            .then(resources => resources.filter(res => res.tabId === tabId));
    }

    private getStoredResourceMap(): Promise<any> {
        return browser.storage.sync
            .get(StorageHelper.RESOURCE_ALIAS)
            .then((storage) => storage[StorageHelper.RESOURCE_ALIAS]);
    }

    private setBadgeText(resourceCount: () => number, tabId: number) {
        browser.browserAction.setBadgeText(
            {
                text: String(resourceCount()),
                tabId: tabId
            }
        );
    }
}
