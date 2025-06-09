// Importação dos módulos necessários para o roteamento
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage } from './login.page';

// Definição das rotas para o módulo de login
const routes: Routes = [
  {
    path: '', // Caminho vazio corresponde à rota principal deste módulo
    component: LoginPage // Componente a ser apresentado nesta rota
  }
];

// Decorador que define o módulo de rotas da página de login
@NgModule({
  imports: [RouterModule.forChild(routes)], // Importa as rotas como um módulo filho
  exports: [RouterModule], // Exporta o RouterModule para uso noutros módulos
})
export class LoginPageRoutingModule {}
