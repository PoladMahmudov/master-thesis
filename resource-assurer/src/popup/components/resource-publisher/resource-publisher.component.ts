import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Resource } from 'src/lib/storage/resource';
import { BrowserStorageHelper } from 'src/lib/storage/browser-storage-helper';
import { ResourceStruct } from 'src/lib/blockchain/assurer/resource.struct';
import { ResourceManager } from 'src/lib/resource-manager/resource-manager';
import { AssurerContract } from 'src/lib/blockchain/assurer/assurer.contract';

@Component({
  selector: 'popup-resource-publisher',
  templateUrl: './resource-publisher.component.html',
  styleUrls: ['./resource-publisher.component.scss']
})
export class ResourcePublisherComponent implements OnInit {

  private _struct: ResourceStruct;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly storage: BrowserStorageHelper,
    private readonly blockchain: AssurerContract,
    private readonly resourceManager: ResourceManager
  ) { }

  ngOnInit(): void {
    this.route.params
      .subscribe(params => this.getResource(params['hash']));
  }

  get struct(): ResourceStruct {
    return this._struct;
  }

  async submitStruct(): Promise<void> {
    this.blockchain.publish(this._struct)
      .then(() => this.resourceManager.refreshResource(this._struct.hash))
      .then(() => this.router.navigate(['/']));
  }

  private async getResource(hash: string) {
    this.storage.getByHash(hash)
      .then(res => this.initStruct(res));
  }

  private initStruct(resource: Resource): void {
    const struct = new ResourceStruct();
    struct.hash = resource.resourceHash;
    struct.repo_uri = undefined;
    struct.uri = resource.resourceUrl;
    this._struct = struct;
  }
}
