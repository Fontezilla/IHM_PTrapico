// Importação dos módulos necessários do Angular e Ionic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Módulo com diretivas comuns do Angular
import { FormsModule } from '@angular/forms'; // Módulo para formulários

import { IonicModule } from '@ionic/angular'; // Módulo principal do Ionic

import { Stage2ShopPageRoutingModule } from './stage2-shop-routing.module'; // Módulo de rotas específico da página de seleção de loja

import { Stage2ShopPage } from './stage2-shop.page'; // Componente da página de seleção de loja

// Decorador que define o módulo Stage2ShopPageModule
@NgModule({
  imports: [
    CommonModule, // Importa diretivas comuns
    FormsModule, // Importa funcionalidades de formulários
    IonicModule, // Importa componentes do Ionic
    Stage2ShopPageRoutingModule // Importa as rotas da página de seleção de loja
  ],
  declarations: [Stage2ShopPage] // Declara o componente Stage2ShopPage neste módulo
})
export class Stage2ShopPageModule {}
