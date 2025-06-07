// Importação dos módulos necessários do Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importação do componente da página
import { MenuPage } from './menu.page';

// Definição das rotas do módulo
const routes: Routes = [
  {
    path: '', // Rota vazia corresponde à rota principal
    component: MenuPage
  }
];

// Decorador que define o módulo de rotas
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
