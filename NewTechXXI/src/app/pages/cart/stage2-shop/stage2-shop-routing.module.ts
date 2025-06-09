// Importação dos módulos necessários para o roteamento
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // Módulos para configuração de rotas

import { Stage2ShopPage } from './stage2-shop.page'; // Importação do componente da página de seleção de loja

// Definição das rotas para o módulo da página de seleção de loja
const routes: Routes = [
  {
    path: '', // Rota raiz do módulo
    component: Stage2ShopPage // Componente a ser carregado nesta rota
  }
];

// Decorador que define o módulo de rotas Stage2ShopPageRoutingModule
@NgModule({
  imports: [RouterModule.forChild(routes)], // Configuração das rotas filhas
  exports: [RouterModule], // Exporta o RouterModule para uso em outros módulos
})
export class Stage2ShopPageRoutingModule {}
