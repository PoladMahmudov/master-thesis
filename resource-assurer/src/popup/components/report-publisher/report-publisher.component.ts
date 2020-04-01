import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceStorageHelper } from 'src/lib/resource-manager/resource-storage-helper';
import { Resource } from 'src/lib/resource-manager/resource';
import { ReportStruct } from 'src/lib/blockchain/assurer/report.struct';
import { AssurerContract } from 'src/lib/blockchain/assurer/assurer.contract';
import { ResourceManager } from 'src/lib/resource-manager/resource-manager';
import { PostAction } from 'src/lib/blockchain/assurer/post.action';

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
    private readonly storage: ResourceStorageHelper,
    private readonly blockchain: AssurerContract,
    private readonly resourceManager: ResourceManager
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
      .then(() => this.resourceManager.refreshResource(this._action.resource_hash))
      .then(() => this.router.navigate(['/']));
  }

  private getResource(hash: string) {
    this.storage.getByHash(hash)
      .then(res => this.initAction(res));
  }

  private initAction(resource: Resource): void {
    const action = new PostAction();
    action.resource_hash = resource.resourceHash;
    action.report_uri = undefined;
    action.title = undefined;
    action.description = undefined;
    action.verdict = undefined;
    this._action = action;
  }
}
