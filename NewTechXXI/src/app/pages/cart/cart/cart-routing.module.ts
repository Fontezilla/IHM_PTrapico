// Importação dos módulos necessários para o roteamento
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CartPage } from '../cart/cart.page'; // Importa o componente da página de carrinho

// Definição das rotas para o módulo da página de carrinho
const routes: Routes = [
  {
    path: '', // Caminho vazio corresponde à rota principal deste módulo
    component: CartPage // Componente a ser apresentado nesta rota
  }
];

// Decorador que define o módulo de rotas da página de carrinho
@NgModule({
  imports: [RouterModule.forChild(routes)], // Importa as rotas como um módulo filho
  exports: [RouterModule], // Exporta o RouterModule para uso noutros módulos
})
export class CartPageRoutingModule {}
