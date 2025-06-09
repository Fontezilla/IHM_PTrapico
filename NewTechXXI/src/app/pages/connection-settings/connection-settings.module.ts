// Importação dos módulos necessários do Angular e Ionic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

// Importação do módulo de rotas específico da página
import { ConnectionSettingsPageRoutingModule } from './connection-settings-routing.module';

// Importação do componente da página
import { ConnectionSettingsPage } from './connection-settings.page';

// Decorador que define o módulo da página de definições de conexão
@NgModule({
  imports: [
    CommonModule, // Módulo comum do Angular
    FormsModule, // Módulo para formulários
    IonicModule, // Módulo do Ionic
    ConnectionSettingsPageRoutingModule // Módulo de rotas específico
  ],
  declarations: [ConnectionSettingsPage] // Declaração do componente da página
})
export class ConnectionSettingsPageModule {}
