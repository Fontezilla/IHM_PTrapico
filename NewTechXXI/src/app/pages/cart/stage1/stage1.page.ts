import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiEndpoints } from 'src/app/services/api/api-endpoints.enum';
import { Storage } from '@ionic/storage-angular';
import { CheckoutService, ProdutoCarrinho } from 'src/app/services/checkout-service/checkout-service.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-stage1',
  templateUrl: './stage1.page.html',
  styleUrls: ['./stage1.page.scss'],
  standalone: false,
})
export class Stage1Page implements OnInit {
  selectedDelivery: 'store' | 'home' | null = null;
  total: number = 0;

  constructor(
    private router: Router,
    private api: ApiService,
    private storage: Storage,
    private checkoutService: CheckoutService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    await this.inicializarCarrinho();
  }

  async inicializarCarrinho() {
    await this.storage.create();

    const rawUser = await this.storage.get('utilizador');
    if (!rawUser) return;

    const utilizador = typeof rawUser === 'string' ? JSON.parse(rawUser) : rawUser;
    const userId = utilizador.id;

    this.api.get(`carrinhos/utilizador/${userId}`).subscribe({
      next: (carrinhos) => {
        if (!carrinhos || carrinhos.length === 0) {
          console.warn('Nenhum carrinho encontrado para o utilizador.');
          return;
        }

        const carrinho = carrinhos[0];
        this.checkoutService.setCarrinhoId(carrinho.id);

        this.api.get(`${ApiEndpoints.CARRINHO_PRODUTOS}/detalhes/${carrinho.id}`).subscribe(produtos => {
          const produtosCheckout: ProdutoCarrinho[] = produtos.map((prod: any) => ({
            id: prod.id,
            produtoId: prod.produto_id,
            quantidade: prod.quantidade,
            precoUnitario: prod.preco
          }));

          this.checkoutService.setProdutos(produtosCheckout);

          // Calcular e guardar total
          const totalCalculado = produtosCheckout.reduce((sum, p) => sum + p.quantidade * p.precoUnitario, 0);
          this.checkoutService.setTotal(totalCalculado);
          this.total = totalCalculado;
        });
      }
    });
  }

  // Método chamado ao clicar numa opção de entrega
  selectDelivery(tipo: 'store' | 'home') {
    this.selectedDelivery = tipo;
  }

  // Botão para continuar para a etapa 2
  continuar() {
    if (!this.selectedDelivery) return;

    // Guardar escolha no serviço
    const tipo = this.selectedDelivery === 'store' ? 'LOJA' : 'MORADA';
    this.checkoutService.setTipoEntrega(tipo);

    // Redirecionar para a próxima etapa
    if (tipo === 'LOJA') {
      this.router.navigateByUrl('/stage2-shop');
    } else {
      this.router.navigateByUrl('/stage2-home');
    }
  }

  // Botão de voltar (ícone topo)
  goBack() {
    this.navCtrl.back();
  }
}
