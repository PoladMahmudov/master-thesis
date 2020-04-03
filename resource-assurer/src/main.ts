import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { PopupModule } from './popup/popup.module';
import { environment, init } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// initialize environment 
init();

platformBrowserDynamic().bootstrapModule(PopupModule)
  .catch(err => console.error(err));
