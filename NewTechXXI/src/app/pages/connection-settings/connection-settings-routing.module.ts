import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConnectionSettingsPage } from './connection-settings.page';

const routes: Routes = [
  {
    path: '',
    component: ConnectionSettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectionSettingsPageRoutingModule {}
