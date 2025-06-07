// Importação dos módulos necessários do Angular e Ionic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';

import { SharedModule } from 'src/app/shared/shared.module';

// Decorador que define o módulo da página inicial
@NgModule({
  // Declaração do componente HomePage neste módulo
  declarations:[
    HomePage,
  ],
  // Importação dos módulos necessários para esta página
  imports: [
    CommonModule, // Módulo com diretivas comuns do Angular
    FormsModule, // Módulo para formulários
    IonicModule, // Módulo do Ionic
    HomePageRoutingModule, // Módulo de rotas específico da página inicial
    SharedModule // Módulo compartilhado com funcionalidades comuns
  ],
})
export class HomePageModule {}
