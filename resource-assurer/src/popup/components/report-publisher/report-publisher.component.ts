import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BrowserStorageHelper } from 'src/lib/storage/browser-storage-helper';
import { Resource } from 'src/lib/storage/resource';
import { ReportStruct } from 'src/lib/blockchain/assurer/report.struct';
import { AssurerContract } from 'src/lib/blockchain/assurer/assurer.contract';
import { ResourceManager } from 'src/lib/resource-manager/resource-manager';

@Component({
  selector: 'popup-report-publisher',
  templateUrl: './report-publisher.component.html',
  styleUrls: ['./report-publisher.component.scss']
})
export class ReportPublisherComponent implements OnInit {

  private _struct: ReportStruct;

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

  get struct(): ReportStruct {
    return this._struct;
  }

  submitStruct(): void {
    this.blockchain.post(this._struct)
    .then(() => this.resourceManager.refreshResource(this._struct.resource_hash))
      .then(() => this.router.navigate(['/']));
  }

  private async getResource(hash: string) {
    this.storage.getByHash(hash)
      .then(res => this.initStruct(res));
  }

  private initStruct(resource: Resource): void {
    const struct = new ReportStruct();
    struct.resource_hash = resource.resourceHash;
    struct.report_uri = undefined;
    struct.description = undefined;
    struct.verdict = undefined;
    this._struct = struct;
  }
}
