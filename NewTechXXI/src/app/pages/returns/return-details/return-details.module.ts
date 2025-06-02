import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReturnDetailsPageRoutingModule } from './return-details-routing.module';

import { ReturnDetailsPage } from './return-details.page';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReturnDetailsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ReturnDetailsPage]
})
export class ReturnDetailsPageModule {}
