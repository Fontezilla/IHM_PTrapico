import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Stage3PageRoutingModule } from './stage3-routing.module';

import { Stage3Page } from './stage3.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Stage3PageRoutingModule
  ],
  declarations: [Stage3Page]
})
export class Stage3PageModule {}
