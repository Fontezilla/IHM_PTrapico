// Importação dos módulos necessários do Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importação do módulo Ionic
import { IonicModule } from '@ionic/angular';

// Importação do módulo de roteamento da página
import { ProductDetailsPageRoutingModule } from './product-details-routing.module';

// Importação do componente da página
import { ProductDetailsPage } from './product-details.page';

// Importação do módulo compartilhado
import { SharedModule } from 'src/app/shared/shared.module';

// Decorador que define o módulo da página de detalhes do produto
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductDetailsPageRoutingModule,
    SharedModule
  ],
  declarations: [ProductDetailsPage]
})
export class ProductDetailsPageModule {}
