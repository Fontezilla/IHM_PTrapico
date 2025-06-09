// Importação dos módulos necessários do Angular e Ionic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Módulo com diretivas comuns do Angular
import { FormsModule } from '@angular/forms'; // Módulo para formulários

import { IonicModule } from '@ionic/angular'; // Módulo principal do Ionic

import { FinishPageRoutingModule } from './finish-routing.module'; // Módulo de rotas específico da página de finalização

import { FinishPage } from './finish.page'; // Componente da página de finalização

// Decorador que define o módulo FinishPageModule
@NgModule({
  imports: [
    CommonModule, // Importa diretivas comuns
    FormsModule, // Importa funcionalidades de formulários
    IonicModule, // Importa componentes do Ionic
    FinishPageRoutingModule // Importa as rotas da página de finalização
  ],
  declarations: [FinishPage] // Declara o componente FinishPage neste módulo
})
export class FinishPageModule {}
