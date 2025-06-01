import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WipPageRoutingModule } from './wip-routing.module';

import { WipPage } from './wip.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WipPageRoutingModule
  ],
  declarations: [WipPage]
})
export class WipPageModule {}
