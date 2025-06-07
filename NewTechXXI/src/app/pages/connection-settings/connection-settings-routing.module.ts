// Importação dos módulos necessários do Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importação do componente da página
import { ConnectionSettingsPage } from './connection-settings.page';

// Definição das rotas do módulo
const routes: Routes = [
  {
    path: '', // Rota principal (vazia)
    component: ConnectionSettingsPage // Componente a ser carregado
  }
];

// Decorador que define o módulo de rotas
@NgModule({
  imports: [RouterModule.forChild(routes)], // Importa o RouterModule com as rotas definidas
  exports: [RouterModule], // Exporta o RouterModule para uso em outros módulos
})
export class ConnectionSettingsPageRoutingModule {}
