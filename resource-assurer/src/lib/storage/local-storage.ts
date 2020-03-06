import { Resource } from './resource';
import { EventEmitter } from '@angular/core';

/** @deprecated */
export class LocalStorage {
    protected static _instance: LocalStorage;

    private readonly resources: Map<string, Resource>;
    private readonly eventEmitter: EventEmitter<Resource>;

    constructor() {
        if (LocalStorage._instance) {
            throw new Error("Instantiation failed: " +
                "use Singleton.getInstance() instead of new.");
        }
        this.resources = new Map<string, Resource>();
        this.eventEmitter = new EventEmitter();
        LocalStorage._instance = this;
    }

    public static getInstance(): LocalStorage {
        if (LocalStorage._instance) {
            return LocalStorage._instance;
        }
        return LocalStorage._instance = new LocalStorage();
    }

    /**
     * Stores resource in a map by hash-code.
     * The resources that already exist in a map
     * are  overridden.
     * 
     * @param resource to be stored
     */
    public store(resource: Resource): void {
        this.resources.set(resource.resourceHash, resource);
        this.postStore(resource);
    }

    /**
     * Returns array of resources for given tab ID number
     * 
     * @param tabId identification number of the tab
     * @returns resource array
     */
    public getByTab(tabId: number): Resource[] {
        return Array.from(this.resources.values())
            .filter(res => res.tabId === tabId);
    }

    /**
     * Deletes resource in map
     * 
     * @param hash identification number of the tab
     * @returns promise of void
     */
    public delete(hash: string): void {
        this.resources.delete(hash);
    }

    // public onChange(callback: (res: Resource) => void): Subscription {
    //     return this.eventEmitter.subscribe((res) => callback(res));
    // }

    public onChange(): EventEmitter<Resource> {
        return this.eventEmitter;
    }

    private setBadgeText(resourceCount: number, tabId: number) {
        browser.browserAction
            .setBadgeText({ text: String(resourceCount), tabId: tabId });
    }

    private postStore(resource: Resource) {
        const resources = this.getByTab(resource.tabId);
        this.setBadgeText(resources.length, resource.tabId);
        this.eventEmitter.emit(resource);
    }
}