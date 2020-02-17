import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResourcesComponent } from './resources/resources.component';


const routes: Routes = [
  { path: '', redirectTo: '/resources', pathMatch: 'full'},
  { path: 'resources', component: ResourcesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class PopupRoutingModule { }
