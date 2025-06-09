import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { ApiService }        from 'src/app/services/api/api.service';
import { ApiEndpoints }      from 'src/app/services/api/api-endpoints.enum';
import { Storage }           from '@ionic/storage-angular';
import {
  CheckoutService,
  ProdutoCarrinho
} from 'src/app/services/checkout-service/checkout-service.service';
import { NavController }     from '@ionic/angular';

@Component({
  selector: 'app-stage1',
  templateUrl: './stage1.page.html',
  styleUrls: ['./stage1.page.scss'],
  standalone: false
})
export class Stage1Page implements OnInit {
  // Tipo de entrega selecionado: loja ou morada
  selectedDelivery: 'store' | 'home' | null = null;
  // Total do carrinho
  total = 0;

  // Injecção de dependências necessárias
  constructor(
    private router: Router,
    private api: ApiService,
    private storage: Storage,
    private checkoutService: CheckoutService,
    private navCtrl: NavController
  ) {}

  // Método do ciclo de vida do Angular, chamado na inicialização
  ngOnInit() {}

  // Método chamado sempre que a página vai ser apresentada
  async ionViewWillEnter() {
    await this.storage.create();
    const rawUser = await this.storage.get('utilizador');
    if (!rawUser) return;
    const user = typeof rawUser === 'string' ? JSON.parse(rawUser) : rawUser;

    // Busca o carrinho do utilizador
    this.api.get(`carrinhos/utilizador/${user.id}`).subscribe({
      next: (carts: any[]) => {
        if (!carts.length) return;
        const cart = carts[0];
        this.checkoutService.setCarrinhoId(cart.id);

        // Busca os produtos do carrinho
        this.api
          .get(`${ApiEndpoints.CARRINHO_PRODUTOS}/detalhes/${cart.id}`)
          .subscribe((items: any[]) => {
            const produtos: ProdutoCarrinho[] = items.map(i => ({
              id: i.id,
              nome: i.nome,
              produtoId: i.produto_id,
              quantidade: i.quantidade,
              precoUnitario: i.preco
            }));
            this.checkoutService.setProdutos(produtos);
            const sum = produtos.reduce(
              (s, p) => s + p.quantidade * p.precoUnitario,
              0
            );
            this.checkoutService.setTotal(sum);
            this.total = sum;
          });
      },
      error: err => console.error('Erro ao buscar carrinho:', err)
    });
  }

  // Seleciona o tipo de entrega
  selectDelivery(tipo: 'store' | 'home') {
    this.selectedDelivery = tipo;
  }

  // Avança para a próxima etapa do checkout
  continuar() {
    if (!this.selectedDelivery) return;
    const tipo = this.selectedDelivery === 'store' ? 'LOJA' : 'MORADA';
    this.checkoutService.setTipoEntrega(tipo);
    this.router.navigateByUrl(
      tipo === 'LOJA' ? '/stage2-shop' : '/stage2-home'
    );
  }

  // Volta para a página anterior
  goBack() {
    this.navCtrl.back();
  }
}