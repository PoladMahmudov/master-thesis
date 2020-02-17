import { Component, OnInit, OnDestroy } from '@angular/core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { Resource } from 'src/lib/storage/resource';
import { StorageHelper } from 'src/lib/storage/storage-helper';

const storage = new StorageHelper();

@Component({
  selector: 'popup-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit, OnDestroy {

  readonly faCoffee = faCoffee;

  private _resources: Resource[] = [];
  private storageListener = (changes, storageName) => {
    if (storageName === StorageHelper.RESOURCE_ALIAS)
      this._resources = changes.resources.newValue as Resource[];
  }

  constructor() { }

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

  private initResources(): void {
    storage.getResources()
      .then(res => {console.log('[ALL]', res); return res})
      .then(resources => this._resources = resources)
  }
}
