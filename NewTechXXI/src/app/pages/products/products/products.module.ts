// Importação dos módulos necessários do Angular e Ionic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Módulo com diretivas comuns do Angular
import { FormsModule } from '@angular/forms'; // Módulo para formulários

import { IonicModule } from '@ionic/angular'; // Módulo principal do Ionic

import { ProductsPageRoutingModule } from './products-routing.module'; // Módulo de rotas específico da página de produtos

import { ProductsPage } from './products.page'; // Componente da página de produtos

import { SharedModule } from 'src/app/shared/shared.module'; // Módulo compartilhado

// Decorador que define o módulo ProductsPageModule
@NgModule({
  imports: [
    CommonModule, // Importa diretivas comuns
    FormsModule, // Importa funcionalidades de formulários
    IonicModule, // Importa componentes do Ionic
    ProductsPageRoutingModule, // Importa as rotas da página de produtos
    SharedModule, // Importa o módulo compartilhado
  ],
  declarations: [ProductsPage] // Declara o componente ProductsPage neste módulo
})
export class ProductsPageModule {}
