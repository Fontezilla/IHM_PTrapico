import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Stage2PageRoutingModule } from './stage2-routing.module';

import { Stage2Page } from './stage2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Stage2PageRoutingModule
  ],
  declarations: [Stage2Page]
})
export class Stage2PageModule {}
