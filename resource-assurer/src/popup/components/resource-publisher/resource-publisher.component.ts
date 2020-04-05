import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssurerContract } from 'src/lib/blockchain/assurer/assurer.contract';
import { PublishAction } from 'src/lib/blockchain/assurer/actions';
import { getCurrentAccountName } from 'src/lib/blockchain/configuration/account-storage';
import { getResourceByHash, Resource } from 'src/lib/resource-manager/resource-storage';
import { refreshResource } from 'src/lib/resource-manager/resource-manager';

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
    private readonly blockchain: AssurerContract
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
      .then(() => refreshResource(this._action.hash))
      .then(() => this.router.navigate(['/']));
  }

  private async getResource(hash: string): Promise<void> {
    getResourceByHash(hash)
      .then(res => this.initAction(res));
  }

  private async initAction(resource: Resource): Promise<void> {
    this._action = {
      hash: resource.resourceHash,
      repo_uri: undefined,
      uri: resource.resourceUrl,
      user: await getCurrentAccountName()
    };
  }
}
