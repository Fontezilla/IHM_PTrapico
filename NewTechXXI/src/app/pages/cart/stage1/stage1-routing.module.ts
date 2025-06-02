import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Stage1Page } from './stage1.page';

const routes: Routes = [
  {
    path: '',
    component: Stage1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Stage1PageRoutingModule {}
