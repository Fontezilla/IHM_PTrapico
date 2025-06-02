import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Stage1PageRoutingModule } from './stage1-routing.module';

import { Stage1Page } from './stage1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Stage1PageRoutingModule
  ],
  declarations: [Stage1Page]
})
export class Stage1PageModule {}
