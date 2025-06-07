// Importação dos módulos necessários do Angular Router
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importação do componente de devolução
import { ReturnPage } from './return.page';

// Definição das rotas do módulo de devolução
const routes: Routes = [
  {
    path: '', // Rota vazia indica a rota padrão
    component: ReturnPage // Componente a ser carregado
  }
];

// Definição do módulo de rotas da devolução
@NgModule({
  imports: [RouterModule.forChild(routes)], // Configuração das rotas filhas
  exports: [RouterModule], // Exportação do módulo de rotas
})
export class ReturnPageRoutingModule {}
