import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../pages/home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'menu',
        loadChildren: () => import('../pages/menu/menu.module').then(m => m.MenuPageModule)
      },
      {
        path: 'cart',
        loadChildren: () => import('../pages/cart/cart/cart.module').then(m => m.CartPageModule)
      },
      {
        path: 'account-settings',
        loadChildren: () => import('../pages/account-settings/account-settings.module').then(m => m.AccountSettingsPageModule)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
