import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Stage4Page } from './stage4.page';

const routes: Routes = [
  {
    path: '',
    component: Stage4Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Stage4PageRoutingModule {}
