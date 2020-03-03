import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { PopupRoutingModule } from './popup-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PopupComponent } from './popup.component';
import { ResourcesComponent } from './resources/resources.component';
import { ResourcePublisherComponent } from './resource-publisher/resource-publisher.component';

@NgModule({
  declarations: [
    PopupComponent,
    ResourcesComponent,
    ResourcePublisherComponent
  ],
  imports: [
    BrowserModule,
    PopupRoutingModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [PopupComponent]
})
export class PopupModule { }
