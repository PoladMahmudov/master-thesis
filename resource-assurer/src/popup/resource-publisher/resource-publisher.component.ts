import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Resource } from 'src/lib/storage/resource';
import { BrowserStorageHelper } from 'src/lib/storage/browser-storage-helper';

@Component({
  selector: 'popup-resource-publisher',
  templateUrl: './resource-publisher.component.html',
  styleUrls: ['./resource-publisher.component.scss']
})
export class ResourcePublisherComponent implements OnInit {

  private resource: Resource;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly storage: BrowserStorageHelper
  ) {

  }

  ngOnInit(): void {
    this.route.params
      .subscribe(params => this.getResource(params['hash']));
  }

  private async getResource(hash: string) {
    const tabId = await this.getCurrentTab();
    this.storage.getByHash(tabId, hash)
      .then(res => this.resource = res);
  }

  private getCurrentTab(): Promise<number> {
    return browser.tabs.query({ active: true, currentWindow: true })
      .then(tab => tab[0].id);
  }
}
