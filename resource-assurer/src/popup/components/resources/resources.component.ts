import { Component, OnInit } from '@angular/core';
import { Resource } from 'src/lib/resource-manager/resource';
import { ResourceStorageHelper } from 'src/lib/resource-manager/resource-storage-helper';
import { ResourceStateType } from 'src/lib/resource-manager/resource-state.type';
import { faLink, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'
import { Report } from 'src/lib/resource-manager/report';

@Component({
  selector: 'popup-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {

  readonly state = ResourceStateType;
  readonly faLink = faLink;
  readonly faThumbsUp = faThumbsUp;
  readonly faThumbsDown = faThumbsDown;

  private _resources: Resource[] = [];

  constructor(private readonly storage: ResourceStorageHelper) {
  }

  get resources(): Resource[] {
    return this._resources;
  }

  ngOnInit(): void {
    this.initResources();
    this.startStorageListener();
  }

  public retrieveFileName(uri: string): string {
    const regex = /\/([^\/]*\.js)/gm;
    const subs = uri.match(regex);

    if (!subs || subs.length === 0) {
      return uri;
    }
    return subs[subs.length - 1];
  }

  public countReliabilityRate(reports: Report[]): number {
    if (reports.length <= 0) {
      return 0;
    }
    const reliable = reports.reduce((acc, current) => acc + (current.verdict ? 1 : 0), 0);
    return reliable / reports.length * 100;
  }

  private async initResources(): Promise<void> {
    this.storage.getByTab(await this.getCurrentTab())
      .then(resources => this._resources = resources);
  }

  private async startStorageListener() {
    this.storage.addChangeListener(
      await this.getCurrentTab(),
      () => this.initResources()
    );
  }

  private getCurrentTab(): Promise<number> {
    return browser.tabs.query({ active: true, currentWindow: true })
      .then(tab => tab[0].id);
  }
}
