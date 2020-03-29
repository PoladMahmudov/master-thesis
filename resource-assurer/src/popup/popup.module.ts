import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { PopupRoutingModule } from './popup-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { PopupComponent } from './components/popup.component';
import { ResourcesComponent } from './components/resources/resources.component';
import { ResourcePublisherComponent } from './components/resource-publisher/resource-publisher.component';
import { ResourceStorageHelper } from 'src/lib/resource-manager/resource-storage-helper';
import { ReportPublisherComponent } from './components/report-publisher/report-publisher.component';
import { ResourceManager } from 'src/lib/resource-manager/resource-manager';
import { AssurerContract } from 'src/lib/blockchain/assurer/assurer.contract';
import { ReportsComponent } from './components/reports/reports.component';

@NgModule({
  declarations: [
    PopupComponent,
    ResourcesComponent,
    ResourcePublisherComponent,
    ReportPublisherComponent,
    ReportsComponent
  ],
  imports: [
    BrowserModule,
    PopupRoutingModule,
    FontAwesomeModule,
    FormsModule
  ],
  providers: [
    ResourceStorageHelper,
    AssurerContract,
    ResourceManager
  ],
  bootstrap: [PopupComponent]
})
export class PopupModule { }
