import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'connection-check',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./pages/menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'account-settings',
    loadChildren: () => import('./pages/account-settings/account-settings.module').then( m => m.AccountSettingsPageModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./pages/cart/cart/cart.module').then( m => m.CartPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./pages/notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'wip',
    loadChildren: () => import('./pages/wip/wip.module').then( m => m.WipPageModule)
  },
  {
    path: 'splash',
    loadChildren: () => import('./pages/splash/splash.module').then( m => m.SplashPageModule)
  },
  {
    path: 'splash-screen',
    loadChildren: () => import('./pages/account-settings/account-settings.module').then(m => m.AccountSettingsPageModule)
  },
  {
    path: 'connection-check',
    loadChildren: () => import('./pages/connection-check/connection-check.module').then( m => m.ConnectionCheckPageModule)
  },
  {
    path: 'connection-settings',
    loadChildren: () => import('./pages/connection-settings/connection-settings.module').then( m => m.ConnectionSettingsPageModule)
  },
  {
    path: 'products/:id',
    loadChildren: () => import('./pages/products/products/products.module').then( m => m.ProductsPageModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./pages/products/products/products.module').then( m => m.ProductsPageModule)
  },
  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
