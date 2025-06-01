import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConnectionCheckPageRoutingModule } from './connection-check-routing.module';

import { ConnectionCheckPage } from './connection-check.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectionCheckPageRoutingModule
  ],
  declarations: [ConnectionCheckPage]
})
export class ConnectionCheckPageModule {}
