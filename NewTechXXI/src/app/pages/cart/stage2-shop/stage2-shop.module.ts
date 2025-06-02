import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Stage2ShopPageRoutingModule } from './stage2-shop-routing.module';

import { Stage2ShopPage } from './stage2-shop.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Stage2ShopPageRoutingModule
  ],
  declarations: [Stage2ShopPage]
})
export class Stage2ShopPageModule {}
