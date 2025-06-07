// Importação dos módulos necessários do Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importação do componente da página de detalhes do produto
import { ProductDetailsPage } from './product-details.page';

// Definição das rotas para a página de detalhes do produto
const routes: Routes = [
  {
    path: '',
    component: ProductDetailsPage
  }
];

// Decorador que define o módulo de roteamento
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductDetailsPageRoutingModule {}
