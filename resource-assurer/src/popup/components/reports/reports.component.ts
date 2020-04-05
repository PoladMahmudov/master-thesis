import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResourceStorageHelper } from 'src/lib/resource-manager/resource-storage-helper';
import { Report } from 'src/lib/resource-manager/report';
import { faLink, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import { ResourceManager } from 'src/lib/resource-manager/resource-manager';
import { Vote } from 'src/lib/resource-manager/vote';
import { AccountStorageHelper } from 'src/lib/blockchain/configuration/account-storage-helper';
import { UserAccount } from 'src/lib/blockchain/configuration/user-accout';

@Component({
  selector: 'popup-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  private _reports: Report[];
  private _account: UserAccount;
  readonly faLink = faLink;
  readonly faPlus = faPlus;
  readonly faMinus = faMinus;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly storage: ResourceStorageHelper,
    private readonly resourceManager: ResourceManager,
    private readonly accountHelper: AccountStorageHelper
  ) { }

  ngOnInit(): void {
    this.getCurrentAccount();
    this.route.params
      .subscribe(params => this.getResource(params['hash']));
  }

  get reports(): Report[] {
    return this._reports;
  }

  vote(reportId: number, vote: boolean) {
    this.resourceManager.vote(reportId, vote, this._account.name)
      .then(() => this.updateVotes());
  }

  unvote(reportId: number) {
    this.resourceManager.unvote(reportId, this._account.name)
      .then(() => this.updateVotes());
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
    return !!votes.find(v => v.voter === this._account.name && v.vote === vote);
  }

  private getResource(hash: string): void {
    this.storage.getByHash(hash)
      .then(resource => this.resourceManager.addVotes(resource.reports))
      .then(reports => this._reports = reports);
  }

  private getCurrentAccount(): void {
    this.accountHelper.getCurrent()
      .then(account => this._account = account);
  }

  private updateVotes() {
    this.resourceManager.addVotes(this._reports)
      .then(reports => this._reports = reports);
  }
}
