// Importação dos módulos necessários para o roteamento
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // Módulos para configuração de rotas

import { Stage2HomePage } from './stage2.page'; // Importação do componente da página de etapa 2

// Definição das rotas para o módulo da página de etapa 2
const routes: Routes = [
  {
    path: '', // Rota raiz do módulo
    component: Stage2HomePage // Componente a ser carregado nesta rota
  }
];

// Decorador que define o módulo de rotas Stage2PageRoutingModule
@NgModule({
  imports: [RouterModule.forChild(routes)], // Configuração das rotas filhas
  exports: [RouterModule], // Exporta o RouterModule para uso em outros módulos
})
export class Stage2PageRoutingModule {}
