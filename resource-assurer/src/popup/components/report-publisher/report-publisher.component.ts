import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssurerContract } from 'src/lib/blockchain/assurer/assurer.contract';
import { PostAction } from 'src/lib/blockchain/assurer/actions';
import { getCurrentAccountName } from 'src/lib/blockchain/configuration/account-storage';
import { getResourceByHash, Resource } from 'src/lib/resource-manager/resource-storage';
import { refreshResource } from 'src/lib/resource-manager/resource-manager';

@Component({
  selector: 'popup-report-publisher',
  templateUrl: './report-publisher.component.html',
  styleUrls: ['./report-publisher.component.scss']
})
export class ReportPublisherComponent implements OnInit {

  private _action: PostAction;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly blockchain: AssurerContract
  ) { }

  ngOnInit(): void {
    this.route.params
      .subscribe(params => this.getResource(params['hash']));
  }

  get action(): PostAction {
    return this._action;
  }

  submitAction(): void {
    this.blockchain.post(this._action)
      .then(() => refreshResource(this._action.resource_hash))
      .then(() => this.router.navigate(['/']));
  }

  private getResource(hash: string) {
    getResourceByHash(hash)
      .then(res => this.initAction(res));
  }

  private async initAction(resource: Resource): Promise<void> {
    this._action = {
      resource_hash: resource.resourceHash,
      report_uri: undefined,
      title: undefined,
      description: undefined,
      verdict: undefined,
      user: await getCurrentAccountName()
    };
  }
}
