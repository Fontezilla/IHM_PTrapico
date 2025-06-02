import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ApiEndpoints } from 'src/app/services/api-endpoints.enum';
import { Storage } from '@ionic/storage-angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-stage1',
  templateUrl: './stage1.page.html',
  styleUrls: ['./stage1.page.scss'],
  standalone: false,
})
export class Stage1Page implements OnInit {
  selectedDelivery: 'store' | 'home' = 'home';
  total: number = 0;
  cartItems: any[] = [];
  isEmpty: boolean = true;

  constructor(
    private api: ApiService,
    private storage: Storage,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    await this.api.ensureReady();
    await this.clearPreviousCheckoutData();
    await this.inicializarCarrinhoDoUtilizador();
  }

  private async clearPreviousCheckoutData() {
    const keysToClear = ['localEntrega', 'totalCarrinho', 'moradaId', 'metodoPagamento'];
    for (const key of keysToClear) {
      const exists = await this.storage.get(key);
      if (exists !== null && exists !== undefined) {
        await this.storage.remove(key);
      }
    }
  }

  async inicializarCarrinhoDoUtilizador() {
    await this.storage.create();
    const rawUser = await this.storage.get('utilizador');
    if (!rawUser) return;

    const utilizador = typeof rawUser === 'string' ? JSON.parse(rawUser) : rawUser;
    const userId = utilizador.id;

    this.api.get(`${ApiEndpoints.CARRINHOS}/utilizador/${userId}`).subscribe({
      next: (carrinhos) => {
        if (!carrinhos || carrinhos.length === 0) {
          // Se não existir, cria novo carrinho
          this.api.post(ApiEndpoints.CARRINHOS, { utilizador_id: userId }).subscribe({
            next: async (novoCarrinho) => {
              await this.storage.set('carrinho_id', novoCarrinho.id);
              this.carregarCarrinho(novoCarrinho.id);
            }
          });
        } else {
          const carrinho = carrinhos[0];
          this.storage.set('carrinho_id', carrinho.id);
          this.carregarCarrinho(carrinho.id);
        }
      }
    });
  }

  carregarCarrinho(carrinhoId: number) {
    this.api.get(`${ApiEndpoints.CARRINHO_PRODUTOS}/detalhes/${carrinhoId}`).subscribe(produtos => {
      this.cartItems = produtos;
      this.isEmpty = produtos.length === 0;
      this.atualizarTotal();
    });
  }

  atualizarTotal() {
    this.total = this.cartItems.reduce((sum, item) => {
      const preco = Number(item.preco);
      const quantidade = Number(item.quantidade);
      return isNaN(preco) || isNaN(quantidade) ? sum : sum + preco * quantidade;
    }, 0);
  }

  selectDelivery(option: 'store' | 'home') {
    this.selectedDelivery = option;
  }

  async continuar() {
    if (this.isEmpty) return;
    await this.storage.set('localEntrega', this.selectedDelivery);
    await this.storage.set('totalCarrinho', this.total);
    this.navCtrl.navigateForward('/stage2');
  }

  goBack() {
    this.navCtrl.back();
  }
}