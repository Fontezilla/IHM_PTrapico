import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiEndpoints } from 'src/app/services/api/api-endpoints.enum';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-return',
  templateUrl: './return.page.html',
  styleUrls: ['./return.page.scss'],
  standalone: false,
})
export class ReturnPage implements OnInit {
  recentProducts: any[] = [];         // Lista de produtos comprados recentemente
  selectedProduct: any = null;        // Produto selecionado para devolução
  utilizadorId: number = 0;           // ID do utilizador autenticado

  constructor(
    private api: ApiService,
    private storage: Storage
  ) {}

  async ngOnInit() {
    await this.api.ensureReady();                        // Garante que a base URL foi carregada
    this.utilizadorId = await this.storage.get('userId'); // Busca o ID do utilizador autenticado
    this.carregarProdutosRecentes();
  }

  carregarProdutosRecentes() {
    this.api.get(`${ApiEndpoints.ENCOMENDAS}/encomendas-recentes/${this.utilizadorId}`)
      .subscribe((produtos: any[]) => {
        this.recentProducts = produtos;
      });
  }

  selectProduct(prod: any) {
    this.selectedProduct = prod;
  }

  proceedToDetails() {
    // Aqui podes redirecionar para a próxima página ou guardar o produto selecionado
    console.log('Produto selecionado para devolução:', this.selectedProduct);
  }

  voltar() {
    // Lógica para voltar à página anterior
    window.history.back();
  }
}
