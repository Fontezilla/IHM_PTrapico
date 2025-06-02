import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReturnSuccessPage } from './return-success.page';

const routes: Routes = [
  {
    path: '',
    component: ReturnSuccessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReturnSuccessPageRoutingModule {}
