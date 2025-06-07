import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Stage3PageRoutingModule } from './stage3-routing.module';

import { Stage3Page } from './stage3.page';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Stage3PageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [Stage3Page]
})
export class Stage3PageModule {}
