import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Stage2PageRoutingModule } from './stage2-home-routing.module';

import { Stage2HomePage } from './stage2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Stage2PageRoutingModule
  ],
  declarations: [Stage2HomePage]
})
export class Stage2PageModule {}
