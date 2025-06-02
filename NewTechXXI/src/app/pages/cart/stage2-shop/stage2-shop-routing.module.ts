import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Stage2ShopPage } from './stage2-shop.page';

const routes: Routes = [
  {
    path: '',
    component: Stage2ShopPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Stage2ShopPageRoutingModule {}
