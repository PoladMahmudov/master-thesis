import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Resource } from 'src/lib/resource-manager/resource';
import { ResourceStorageHelper } from 'src/lib/resource-manager/resource-storage-helper';
import { ResourceManager } from 'src/lib/resource-manager/resource-manager';
import { AssurerContract } from 'src/lib/blockchain/assurer/assurer.contract';
import { PublishAction } from 'src/lib/blockchain/assurer/publish.action';

@Component({
  selector: 'popup-resource-publisher',
  templateUrl: './resource-publisher.component.html',
  styleUrls: ['./resource-publisher.component.scss']
})
export class ResourcePublisherComponent implements OnInit {

  private _action: PublishAction;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly storage: ResourceStorageHelper,
    private readonly blockchain: AssurerContract,
    private readonly resourceManager: ResourceManager
  ) { }

  ngOnInit(): void {
    this.route.params
      .subscribe(params => this.getResource(params['hash']));
  }

  get action(): PublishAction {
    return this._action;
  }

  async submitAction(): Promise<void> {
    this.blockchain.publish(this._action)
      .then(() => this.resourceManager.refreshResource(this._action.hash))
      .then(() => this.router.navigate(['/']));
  }

  private async getResource(hash: string) {
    this.storage.getByHash(hash)
      .then(res => this.initAction(res));
  }

  private initAction(resource: Resource): void {
    const action = new PublishAction();
    action.hash = resource.resourceHash;
    action.repo_uri = undefined;
    action.uri = resource.resourceUrl;
    this._action = action;
  }
}
