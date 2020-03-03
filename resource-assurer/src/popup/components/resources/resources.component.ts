import { Component, OnInit, OnDestroy } from '@angular/core';
import { Resource } from 'src/lib/storage/resource';
import { BrowserStorageHelper } from 'src/lib/storage/browser-storage-helper';
import { ResourceStateType } from 'src/lib/storage/resource-state.type';
import { ResourceStatusType } from 'src/lib/storage/resource-status.type';
import { async } from '@angular/core/testing';

@Component({
  selector: 'popup-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit, OnDestroy {

  readonly state = ResourceStateType;

  private _resources: Resource[] = [];

  constructor(private readonly storage: BrowserStorageHelper) {
  }

  get resources(): Resource[] {
    return this._resources;
  }

  ngOnInit(): void {
    this.initResources();
    browser.storage.onChanged.addListener(this.storageListener);
  }

  ngOnDestroy(): void {
    browser.storage.onChanged.removeListener(this.storageListener);
  }

  public resolveTagColor(value: ResourceStateType | ResourceStatusType): string {
    switch (value) {
      case ResourceStateType.PUBLISHED:
        return 'is-dark';
      case ResourceStateType.REPORTED:
        return 'is-primary';
      case ResourceStateType.UNPUBLISHED:
        return 'is-warning'

      case ResourceStatusType.RELIABLE:
        return 'is-success';
      case ResourceStatusType.WARNING:
        return 'is-warning';
      case ResourceStatusType.DANGEROUS:
        return 'is-danger';

      default:
        return 'is-light';
    }
  }

  public retrieveFileName(uri: string): string {
    const regex = /\/([^\/]*\.js)/gm;
    const subs = uri.match(regex);

    if (!subs || subs.length === 0) {
      return uri;
    }
    return subs[subs.length - 1];
  }

  private async initResources(): Promise<void> {
    this.storage.getByTab(await this.getCurrentTab())
      .then(resources => this._resources = resources);
  }

  private storageListener = async (changes, storageName) => {
    if (storageName === BrowserStorageHelper.resourceAlias(await this.getCurrentTab()))
      this._resources = changes.resources.newValue as Resource[];
  }

  private getCurrentTab(): Promise<number> {
    return browser.tabs.query({ active: true, currentWindow: true })
      .then(tab => tab[0].id);
  }
}
