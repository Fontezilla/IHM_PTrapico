// Importação dos módulos necessários do Angular e Ionic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountSettingsPageRoutingModule } from './account-settings-routing.module';

import { AccountSettingsPage } from './account-settings.page';

// Decorador que define o módulo da página de configurações de conta
@NgModule({
  // Importação dos módulos necessários para esta página
  imports: [
    CommonModule, // Módulo com diretivas comuns do Angular
    FormsModule, // Módulo para formulários
    IonicModule, // Módulo do Ionic
    AccountSettingsPageRoutingModule // Módulo de rotas específico da página de configurações de conta
  ],
  // Declaração do componente AccountSettingsPage neste módulo
  declarations: [AccountSettingsPage]
})
export class AccountSettingsPageModule {}
