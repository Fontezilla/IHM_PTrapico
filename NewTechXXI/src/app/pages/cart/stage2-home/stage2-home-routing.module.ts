import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Stage2HomePage } from './stage2.page';

const routes: Routes = [
  {
    path: '',
    component: Stage2HomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Stage2PageRoutingModule {}
