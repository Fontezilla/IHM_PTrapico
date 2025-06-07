// Importação dos módulos necessários do Angular Router
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importação do componente de registo
import { RegisterPage } from './register.page';

// Definição das rotas do módulo de registo
const routes: Routes = [
  {
    path: '', // Rota vazia indica a rota padrão
    component: RegisterPage // Componente a ser carregado
  }
];

// Definição do módulo de rotas do registo
@NgModule({
  imports: [RouterModule.forChild(routes)], // Configuração das rotas filhas
  exports: [RouterModule], // Exportação do módulo de rotas
})
export class RegisterPageRoutingModule {}
