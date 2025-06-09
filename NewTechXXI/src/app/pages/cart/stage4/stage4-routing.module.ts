// Importação dos módulos necessários do Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // Módulos para configuração de rotas

import { Stage4Page } from './stage4.page'; // Importação do componente da página de finalização

// Definição das rotas do módulo
const routes: Routes = [
  {
    path: '', // Rota vazia indica que este é o componente padrão
    component: Stage4Page // Componente a ser carregado quando a rota for acedida
  }
];

// Decorador que define o módulo de rotas
@NgModule({
  imports: [RouterModule.forChild(routes)], // Configuração das rotas filhas
  exports: [RouterModule], // Exporta o RouterModule para uso noutros módulos
})
export class Stage4PageRoutingModule {}
