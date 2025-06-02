import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Stage4PageRoutingModule } from './stage4-routing.module';

import { Stage4Page } from './stage4.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Stage4PageRoutingModule
  ],
  declarations: [Stage4Page]
})
export class Stage4PageModule {}
