import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Stage2Page } from './stage2.page';

const routes: Routes = [
  {
    path: '',
    component: Stage2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Stage2PageRoutingModule {}
