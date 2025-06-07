// Importação dos módulos necessários do Angular e Ionic
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importação do módulo de rotas específico da página
import { TabsPageRoutingModule } from './tabs-routing.module';

// Importação do componente da página
import { TabsPage } from './tabs.page';

// Decorador que define o módulo da página de tabs
@NgModule({
  imports: [
    IonicModule, // Módulo do Ionic
    CommonModule, // Módulo comum do Angular
    FormsModule, // Módulo para formulários
    TabsPageRoutingModule // Módulo de rotas específico
  ],
  declarations: [TabsPage] // Declaração do componente da página
})
export class TabsPageModule {}
