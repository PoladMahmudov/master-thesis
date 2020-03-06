import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { PopupRoutingModule } from './popup-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { PopupComponent } from './components/popup.component';
import { ResourcesComponent } from './components/resources/resources.component';
import { ResourcePublisherComponent } from './components/resource-publisher/resource-publisher.component';
import { BrowserStorageHelper } from 'src/lib/storage/browser-storage-helper';
import { IntegrityContract } from 'src/lib/blockchain/integrity/integrity.contract';
import { ReportPublisherComponent } from './components/report-publisher/report-publisher.component';
import { ReliabilityContract } from 'src/lib/blockchain/reliability/reliability.contract';

@NgModule({
  declarations: [
    PopupComponent,
    ResourcesComponent,
    ResourcePublisherComponent,
    ReportPublisherComponent
  ],
  imports: [
    BrowserModule,
    PopupRoutingModule,
    FontAwesomeModule,
    FormsModule
  ],
  providers: [
    BrowserStorageHelper,
    IntegrityContract,
    ReliabilityContract
  ],
  bootstrap: [PopupComponent]
})
export class PopupModule { }
