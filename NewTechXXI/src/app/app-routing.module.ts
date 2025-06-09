// Importação dos módulos necessários do Angular
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

// Definição das rotas da aplicação
const routes: Routes = [
  {
    path: '', // Rota raiz
    redirectTo: 'connection-check', // Redireciona para a página de verificação de conexão
    pathMatch: 'full'
  },
  {
    path: 'login', // Rota para a página de login
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'tabs', // Rota para a página de abas
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'home', // Rota para a página inicial
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'menu', // Rota para a página de menu
    loadChildren: () => import('./pages/menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'account-settings', // Rota para as configurações da conta
    loadChildren: () => import('./pages/account-settings/account-settings.module').then( m => m.AccountSettingsPageModule)
  },
  {
    path: 'cart', // Rota para o carrinho de compras
    loadChildren: () => import('./pages/cart/cart/cart.module').then( m => m.CartPageModule)
  },
  {
    path: 'register', // Rota para o registro de usuário
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'splash-screen', // Rota para a tela de splash
    loadChildren: () => import('./pages/account-settings/account-settings.module').then(m => m.AccountSettingsPageModule)
  },
  {
    path: 'connection-check', // Rota para verificação de conexão
    loadChildren: () => import('./pages/connection-check/connection-check.module').then( m => m.ConnectionCheckPageModule)
  },
  {
    path: 'connection-settings', // Rota para configurações de conexão
    loadChildren: () => import('./pages/connection-settings/connection-settings.module').then( m => m.ConnectionSettingsPageModule)
  },
  {
    path: 'products/:id', // Rota para produtos com ID específico
    loadChildren: () => import('./pages/products/products/products.module').then( m => m.ProductsPageModule)
  },
  {
    path: 'products', // Rota para lista de produtos
    loadChildren: () => import('./pages/products/products/products.module').then( m => m.ProductsPageModule)
  },
  {
    path: 'product-details/:id', // Rota para detalhes do produto com ID específico
    loadChildren: () =>
      import('./pages/products/product-details/product-details.module').then(m => m.ProductDetailsPageModule)
  },
  {
    path: 'product-details', // Rota para detalhes do produto
    loadChildren: () => import('./pages/products/product-details/product-details.module').then( m => m.ProductDetailsPageModule)
  },
  {
    path: 'stage1', // Rota para o primeiro estágio do carrinho
    loadChildren: () => import('./pages/cart/stage1/stage1.module').then( m => m.Stage1PageModule)
  },
  {
    path: 'stage2-home', // Rota para o segundo estágio do carrinho (entrega em casa)
    loadChildren: () => import('./pages/cart/stage2-home/stage2-home.module').then( m => m.Stage2PageModule)
  },
  {
    path: 'stage3', // Rota para o terceiro estágio do carrinho
    loadChildren: () => import('./pages/cart/stage3/stage3.module').then( m => m.Stage3PageModule)
  },
  {
    path: 'stage4', // Rota para o quarto estágio do carrinho
    loadChildren: () => import('./pages/cart/stage4/stage4.module').then( m => m.Stage4PageModule)
  },
  {
    path: 'stage2-shop', // Rota para o segundo estágio do carrinho (retirada na loja)
    loadChildren: () => import('./pages/cart/stage2-shop/stage2-shop.module').then( m => m.Stage2ShopPageModule)
  },
  {
    path: 'finish', // Rota para finalização da compra
    loadChildren: () => import('./pages/cart/finish/finish.module').then( m => m.FinishPageModule)
  },
  {
    path: 'return', // Rota para página de devolução
    loadChildren: () => import('./pages/returns/return/return.module').then( m => m.ReturnPageModule)
  },
  {
    path: 'return-details', // Rota para detalhes da devolução
    loadChildren: () => import('./pages/returns/return-details/return-details.module').then( m => m.ReturnDetailsPageModule)
  },
  {
    path: 'return-success', // Rota para confirmação de devolução
    loadChildren: () => import('./pages/returns/return-success/return-success.module').then( m => m.ReturnSuccessPageModule)
  },
];

// Decorador que define o módulo de roteamento
@NgModule({
  imports: [
    // Configuração do RouterModule com estratégia de pré-carregamento de todos os módulos
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule] // Exporta o RouterModule para uso em outros módulos
})
export class AppRoutingModule {}
