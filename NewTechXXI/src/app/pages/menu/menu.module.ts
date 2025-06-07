// Importação dos módulos necessários do Angular e Ionic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importação do módulo Ionic
import { IonicModule } from '@ionic/angular';

// Importação do módulo de rotas específico da página
import { MenuPageRoutingModule } from './menu-routing.module';

// Importação do componente da página e do módulo compartilhado
import { MenuPage } from './menu.page';
import { SharedModule } from 'src/app/shared/shared.module';

// Decorador que define o módulo MenuPageModule
@NgModule({
  // Importação dos módulos necessários para esta página
  imports: [
    CommonModule, // Módulo com diretivas comuns do Angular
    FormsModule, // Módulo para formulários
    IonicModule, // Módulo do Ionic
    MenuPageRoutingModule, // Módulo de rotas específico da página de menu
    SharedModule, // Módulo compartilhado com funcionalidades comuns
  ],
  // Declaração do componente MenuPage neste módulo
  declarations: [MenuPage]
})
export class MenuPageModule {}
