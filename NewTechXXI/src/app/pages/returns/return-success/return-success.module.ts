import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReturnSuccessPageRoutingModule } from './return-success-routing.module';

import { ReturnSuccessPage } from './return-success.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReturnSuccessPageRoutingModule
  ],
  declarations: [ReturnSuccessPage]
})
export class ReturnSuccessPageModule {}
