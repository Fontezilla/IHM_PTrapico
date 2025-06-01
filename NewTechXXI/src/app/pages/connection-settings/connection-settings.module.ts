import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConnectionSettingsPageRoutingModule } from './connection-settings-routing.module';

import { ConnectionSettingsPage } from './connection-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectionSettingsPageRoutingModule
  ],
  declarations: [ConnectionSettingsPage]
})
export class ConnectionSettingsPageModule {}
