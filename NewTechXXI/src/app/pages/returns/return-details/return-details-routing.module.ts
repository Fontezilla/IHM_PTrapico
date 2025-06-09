// Importação dos módulos necessários do Angular Router
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importação do componente de detalhes da devolução
import { ReturnDetailsPage } from './return-details.page';

// Definição das rotas do módulo de detalhes da devolução
const routes: Routes = [
  {
    path: '', // Rota vazia indica a rota padrão
    component: ReturnDetailsPage // Componente a ser carregado
  }
];

// Definição do módulo de rotas dos detalhes da devolução
@NgModule({
  imports: [RouterModule.forChild(routes)], // Configuração das rotas filhas
  exports: [RouterModule], // Exportação do módulo de rotas
})
export class ReturnDetailsPageRoutingModule {}
