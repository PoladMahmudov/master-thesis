import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faLink, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { getCurrentAccount } from 'src/lib/blockchain/configuration/account-storage';
import { getResourceByHash, Report, Vote } from 'src/lib/resource-manager/resource-storage';
import { AssurerContract } from 'src/lib/blockchain/assurer/assurer.contract';
import { fetchAndAddVotes } from 'src/lib/resource-manager/resource-manager';

@Component({
  selector: 'popup-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  private _reports: Report[];
  private _account: string;
  readonly faLink = faLink;
  readonly faPlus = faPlus;
  readonly faMinus = faMinus;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly contract: AssurerContract
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
    this.contract.vote({
      voter: this._account,
      vote: vote,
      report_id: reportId
    }).then(() => this.updateVotes());
  }

  unvote(reportId: number) {
    this.contract.unvote({
      voter: this._account,
      report_id: reportId
    }).then(() => this.updateVotes());
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

  private getResource(hash: string): void {
    getResourceByHash(hash)
      .then(resource => fetchAndAddVotes(resource.reports))
      .then(reports => this._reports = reports);
  }

  private getCurrentAccount(): void {
    getCurrentAccount()
      .then(account => this._account = account.name);
  }

  private updateVotes() {
    fetchAndAddVotes(this._reports)
      .then(reports => this._reports = reports);
  }
}
