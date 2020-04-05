import { Component, OnInit } from '@angular/core';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { getResourceByTab, addTabChangeListener, ResourceStateType, Resource, Report } from 'src/lib/resource-manager/resource-storage';
import { getReliabilityThreshold } from 'src/lib/blockchain/configuration/configuration-storage';

@Component({
  selector: 'popup-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {

  readonly state = ResourceStateType;
  readonly faLink = faLink;

  private _resources: Resource[] = [];
  private _threshold = 50;

  constructor() {
  }

  get resources(): Resource[] {
    return this._resources;
  }

  ngOnInit(): void {
    this.initResources();
    this.startStorageListener();
    this.setReliabilityThreshold();
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
    const reliable = reports.reduce((acc, current) =>
      acc + (current.verdict && current.positivesRatio * 100 > this._threshold ? 1 : 0), 0);
    return +(reliable / reports.length * 100).toFixed(2);
  }

  private async initResources(): Promise<void> {
    getResourceByTab(await this.getCurrentTab())
      .then(resources => this._resources = resources);
  }

  private async startStorageListener() {
    addTabChangeListener(
      await this.getCurrentTab(),
      () => this.initResources()
    );
  }

  private getCurrentTab(): Promise<number> {
    return browser.tabs.query({ active: true, currentWindow: true })
      .then(tab => tab[0].id);
  }

  private setReliabilityThreshold(): void {
    getReliabilityThreshold()
      .then(threshold => this._threshold = threshold);
  }
}
