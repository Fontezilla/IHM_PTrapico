// Importação dos módulos necessários para o roteamento
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinishPage } from './finish.page'; // Importa o componente da página de finalização

// Definição das rotas para o módulo da página de finalização
const routes: Routes = [
  {
    path: '', // Caminho vazio corresponde à rota principal deste módulo
    component: FinishPage // Componente a ser apresentado nesta rota
  }
];

// Decorador que define o módulo de rotas da página de finalização
@NgModule({
  imports: [RouterModule.forChild(routes)], // Importa as rotas como um módulo filho
  exports: [RouterModule], // Exporta o RouterModule para uso noutros módulos
})
export class FinishPageRoutingModule {}
