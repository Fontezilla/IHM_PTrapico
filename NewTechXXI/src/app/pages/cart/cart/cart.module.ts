// Importação dos módulos necessários do Angular e Ionic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Módulo com diretivas comuns do Angular
import { FormsModule } from '@angular/forms'; // Módulo para formulários

import { IonicModule } from '@ionic/angular'; // Módulo principal do Ionic

import { CartPageRoutingModule } from './cart-routing.module'; // Módulo de rotas específico da página de carrinho

import { CartPage } from './cart.page'; // Componente da página de carrinho

// Decorador que define o módulo CartPageModule
@NgModule({
  imports: [
    CommonModule, // Importa diretivas comuns
    FormsModule, // Importa funcionalidades de formulários
    IonicModule, // Importa componentes do Ionic
    CartPageRoutingModule // Importa as rotas da página de carrinho
  ],
  declarations: [CartPage] // Declara o componente CartPage neste módulo
})
export class CartPageModule {}
