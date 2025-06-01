import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConnectionCheckPage } from './connection-check.page';

const routes: Routes = [
  {
    path: '',
    component: ConnectionCheckPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectionCheckPageRoutingModule {}
