import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WipPage } from './wip.page';

const routes: Routes = [
  {
    path: '',
    component: WipPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WipPageRoutingModule {}
