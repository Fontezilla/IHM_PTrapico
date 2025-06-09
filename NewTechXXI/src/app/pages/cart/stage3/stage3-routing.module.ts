// Importação dos módulos necessários do Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // Módulos para configuração de rotas

import { Stage3Page } from './stage3.page'; // Importação do componente da página de pagamento

// Definição das rotas do módulo
const routes: Routes = [
  {
    path: '', // Rota vazia indica que este é o componente padrão
    component: Stage3Page // Componente a ser carregado quando a rota for acessada
  }
];

// Decorador que define o módulo de rotas
@NgModule({
  imports: [RouterModule.forChild(routes)], // Configuração das rotas filhas
  exports: [RouterModule], // Exporta o RouterModule para uso em outros módulos
})
export class Stage3PageRoutingModule {}
