import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BrowserStorageHelper } from 'src/lib/storage/browser-storage-helper';
import { ReliabilityContract } from 'src/lib/blockchain/reliability/reliability.contract';
import { Resource } from 'src/lib/storage/resource';
import { ReportStruct } from 'src/lib/blockchain/reliability/report.struct';

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
    private readonly blockchain: ReliabilityContract
  ) { }

  ngOnInit(): void {
    this.route.params
      .subscribe(params => this.getResource(params['hash']));
  }

  get struct(): ReportStruct {
    return this._struct;
  }

  submitStruct(): void {
    this.blockchain.publish(this._struct)
      .then(() => this.router.navigate(['/']));
  }

  private async getResource(hash: string) {
    const tabId = await this.getCurrentTab();
    this.storage.getByHash(tabId, hash)
      .then(res => this.initStruct(res));
  }

  private getCurrentTab(): Promise<number> {
    return browser.tabs.query({ active: true, currentWindow: true })
      .then(tab => tab[0].id);
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
