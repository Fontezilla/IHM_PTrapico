// Importação dos módulos necessários para o roteamento
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Stage1Page } from './stage1.page'; // Importa o componente da página de etapa 1

// Definição das rotas para o módulo da página de etapa 1
const routes: Routes = [
  {
    path: '', // Caminho vazio corresponde à rota principal deste módulo
    component: Stage1Page // Componente a ser apresentado nesta rota
  }
];

// Decorador que define o módulo de rotas da página de etapa 1
@NgModule({
  imports: [RouterModule.forChild(routes)], // Importa as rotas como um módulo filho
  exports: [RouterModule], // Exporta o RouterModule para uso noutros módulos
})
export class Stage1PageRoutingModule {}
