// Importação dos módulos necessários para o roteamento
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountSettingsPage } from './account-settings.page';

// Definição das rotas para o módulo da página de configurações de conta
const routes: Routes = [
  {
    path: '', // Caminho vazio corresponde à rota principal deste módulo
    component: AccountSettingsPage // Componente a ser apresentado nesta rota
  }
];

// Decorador que define o módulo de rotas da página de configurações de conta
@NgModule({
  imports: [RouterModule.forChild(routes)], // Importa as rotas como um módulo filho
  exports: [RouterModule], // Exporta o RouterModule para uso noutros módulos
})
export class AccountSettingsPageRoutingModule {}
