// Importação dos módulos necessários do Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

// Definição das rotas do módulo
const routes: Routes = [
  {
    path: '', // Rota principal (vazia)
    component: TabsPage, // Componente principal
    children: [ // Rotas filhas (tabs)
      {
        path: 'home', // Rota para a página inicial
        loadChildren: () => import('../pages/home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'menu', // Rota para a página de menu
        loadChildren: () => import('../pages/menu/menu.module').then(m => m.MenuPageModule)
      },
      {
        path: 'cart', // Rota para a página do carrinho
        loadChildren: () => import('../pages/cart/cart/cart.module').then(m => m.CartPageModule)
      },
      {
        path: 'account-settings', // Rota para a página de definições da conta
        loadChildren: () => import('../pages/account-settings/account-settings.module').then(m => m.AccountSettingsPageModule)
      },
      {
        path: '', // Rota vazia redireciona para home
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  }
];

// Decorador que define o módulo de rotas
@NgModule({
  imports: [RouterModule.forChild(routes)], // Importa o RouterModule com as rotas definidas
  exports: [RouterModule] // Exporta o RouterModule para uso em outros módulos
})
export class TabsPageRoutingModule {}
