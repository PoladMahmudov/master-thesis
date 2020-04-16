import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faLink, faPlus, faMinus, faHourglassEnd, faBroom, faCheck } from '@fortawesome/free-solid-svg-icons';
import { getCurrentAccount } from 'src/lib/blockchain/configuration/account-storage';
import { getResourceByHash, Report, Vote, Resource } from 'src/lib/resource-manager/resource-storage';
import { AssurerContract } from 'src/lib/blockchain/assurer/assurer.contract';
import { fetchAndAddVotes, refreshResource } from 'src/lib/resource-manager/resource-manager';

@Component({
  selector: 'popup-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  private _resource: Resource;
  private _account: string;
  readonly faLink = faLink;
  readonly faPlus = faPlus;
  readonly faMinus = faMinus;
  readonly faHourglassEnd = faHourglassEnd;
  readonly faBroom = faBroom;
  readonly faCheck = faCheck;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly contract: AssurerContract,
    @Inject('HOLD_PERIOD') private holdPeriod: number,
    @Inject('FREEZE_PERIOD') private freezePeriod: number
  ) {  }

  ngOnInit(): void {
    this.getCurrentAccount();
    this.route.params
      .subscribe(params => this.getResource(params['hash']));
  }

  get reports(): Report[] {
    return this._resource ? this._resource.reports : [];
  }

  set reports(reports: Report[]) {
    this._resource.reports = reports;
  }

  vote(reportId: number, vote: boolean): void {
    this.contract.vote({
      voter: this._account,
      vote: vote,
      report_id: reportId
    }).then(() => this.updateVotes());
  }

  unvote(reportId: number): void {
    this.contract.unvote({
      voter: this._account,
      report_id: reportId
    }).then(() => this.updateVotes());
  }

  expire(reportId: number): void {
    this.contract.expire({ report_id: reportId })
      .then(() => refreshResource(this._resource.resourceHash))
      .then(resource => this.getResource(resource.resourceHash));
  }

  clean(reportId: number, count: number): void {
    this.contract.clean({ report_id: reportId, max_count: count })
      .then(() => refreshResource(this._resource.resourceHash))
      .then(resource => this.getResource(resource.resourceHash));
  }

  countPositives(votes: Vote[]): number {
    return votes
      .reduce((acc, current) => acc + (current.vote ? 1 : 0), 0);
  }

  countNegatives(votes: Vote[]): number {
    return votes
      .reduce((acc, current) => acc + (current.vote ? 0 : 1), 0);
  }

  alreadyVoted(votes: Vote[], vote: boolean): boolean {
    if (votes.length === 0) {
      return false;
    }
    return !!votes.find(v => v.voter === this._account && v.vote === vote);
  }

  expired(expiresOn: Date): boolean {
    return new Date() > expiresOn;
  }

  canExpire(createdOn: Date, reportOwner: string): boolean {
    // can be expired by owner after a week from creation
    return new Date().getTime() - createdOn.getTime() > this.holdPeriod
      && this._account === reportOwner;
  }

  expirationTime(expiresOn: Date): string {
    if (this.expired(expiresOn)) {
      return '0h';
    }
    return this.calcLeftTime(expiresOn);
  }

  canClean(expiresOn: Date): boolean {
    // can be cleaned 3 days after expiration
    return this.expired(expiresOn)
      && new Date().getTime() - expiresOn.getTime() > this.freezePeriod
  }

  cleanTime(expiresOn: Date): string {
    if (this.canClean(expiresOn)) {
      return '0h';
    }
    return this.calcLeftTime(new Date(expiresOn.getTime() + this.freezePeriod));
  }

  private getResource(hash: string): void {
    getResourceByHash(hash)
      .then(resource => { this._resource = resource; return resource; })
      .then(resource => fetchAndAddVotes(resource.reports))
      .then(reports => this.reports = reports);
  }

  private getCurrentAccount(): void {
    getCurrentAccount()
      .then(account => this._account = account.name);
  }

  private updateVotes() {
    fetchAndAddVotes(this.reports)
      .then(reports => this.reports = reports);
  }

  private calcLeftTime(until: Date): string {
    // seconds until expires
    let delta = Math.abs(until.getTime() - new Date().getTime()) / 1000;
    // calculate (and subtract) whole weeks
    const weeks = Math.floor(delta / 86400 / 7);
    delta -= weeks * 86400;
    if (weeks > 0) return weeks + 'w';

    // calculate (and subtract) whole days
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;
    if (days > 0) return days + 'd';

    // calculate (and subtract) whole hours
    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    if (hours > 0) return hours + 'h';

    // calculate (and subtract) whole minutes
    const minutes = Math.floor(delta / 60) % 60;
    return minutes + 'm';
  }
}
