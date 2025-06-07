// Importação dos módulos necessários do Angular e Ionic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Módulo com diretivas comuns do Angular
import { FormsModule } from '@angular/forms'; // Módulo para formulários

import { IonicModule } from '@ionic/angular'; // Módulo principal do Ionic

import { Stage1PageRoutingModule } from './stage1-routing.module'; // Módulo de rotas específico da página de etapa 1

import { Stage1Page } from './stage1.page'; // Componente da página de etapa 1

// Decorador que define o módulo Stage1PageModule
@NgModule({
  imports: [
    CommonModule, // Importa diretivas comuns
    FormsModule, // Importa funcionalidades de formulários
    IonicModule, // Importa componentes do Ionic
    Stage1PageRoutingModule // Importa as rotas da página de etapa 1
  ],
  declarations: [Stage1Page] // Declara o componente Stage1Page neste módulo
})
export class Stage1PageModule {}
