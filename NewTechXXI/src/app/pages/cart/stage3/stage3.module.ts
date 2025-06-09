// Importação dos módulos necessários do Angular e Ionic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Módulo com diretivas comuns do Angular
import { FormsModule } from '@angular/forms'; // Módulo para formulários

import { IonicModule } from '@ionic/angular'; // Módulo principal do Ionic

import { Stage3PageRoutingModule } from './stage3-routing.module'; // Módulo de rotas específico da página de pagamento

import { Stage3Page } from './stage3.page'; // Componente da página de pagamento

import { ReactiveFormsModule } from '@angular/forms'; // Módulo para formulários reativos

// Decorador que define o módulo Stage3PageModule
@NgModule({
  imports: [
    CommonModule, // Importa diretivas comuns
    FormsModule, // Importa funcionalidades de formulários
    IonicModule, // Importa componentes do Ionic
    Stage3PageRoutingModule, // Importa as rotas da página de pagamento
    ReactiveFormsModule, // Importa funcionalidades de formulários reativos
  ],
  declarations: [Stage3Page] // Declara o componente Stage3Page neste módulo
})
export class Stage3PageModule {}
