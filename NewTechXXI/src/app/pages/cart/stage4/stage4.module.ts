// Importação dos módulos necessários do Angular e Ionic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Módulo com diretivas comuns do Angular
import { FormsModule } from '@angular/forms'; // Módulo para formulários

import { IonicModule } from '@ionic/angular'; // Módulo principal do Ionic

import { Stage4PageRoutingModule } from './stage4-routing.module'; // Módulo de rotas específico da página de finalização

import { Stage4Page } from './stage4.page'; // Componente da página de finalização

// Decorador que define o módulo Stage4PageModule
@NgModule({
  imports: [
    CommonModule, // Importa diretivas comuns
    FormsModule, // Importa funcionalidades de formulários
    IonicModule, // Importa componentes do Ionic
    Stage4PageRoutingModule // Importa as rotas da página de finalização
  ],
  declarations: [Stage4Page] // Declara o componente Stage4Page neste módulo
})
export class Stage4PageModule {}
