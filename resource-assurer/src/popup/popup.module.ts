import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { PopupRoutingModule } from './popup-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { PopupComponent } from './components/popup.component';
import { ResourcesComponent } from './components/resources/resources.component';
import { ResourcePublisherComponent } from './components/resource-publisher/resource-publisher.component';
import { ReportPublisherComponent } from './components/report-publisher/report-publisher.component';
import { AssurerContract } from 'src/lib/blockchain/assurer/assurer.contract';
import { ReportsComponent } from './components/reports/reports.component';
import { variables } from 'src/environments/environment';

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
    AssurerContract,
    { provide: 'HOLD_PERIOD', useValue: variables.holdPeriod },
    { provide: 'FREEZE_PERIOD', useValue: variables.freezePeriod }
  ],
  bootstrap: [PopupComponent]
})
export class PopupModule { }
