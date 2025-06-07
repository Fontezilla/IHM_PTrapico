import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiEndpoints } from 'src/app/services/api/api-endpoints.enum';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: false,
})
export class CartPage implements OnInit {
  // Lista de itens no carrinho
  cartItems: any[] = [];
  // Total do valor do carrinho
  total: number = 0;
  // Indica se o carrinho está vazio
  isEmpty: boolean = true;

  // Injecção de dependências necessárias
  constructor(
    private router: Router,
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private storage: Storage,
    private alertController: AlertController
  ) {}

  // Método do ciclo de vida do Angular, chamado na inicialização
  ngOnInit() {}

  // Método chamado sempre que a página vai ser apresentada
  async ionViewWillEnter() {
    await this.inicializarCarrinhoDoUtilizador();
  }

  // Inicializa o carrinho do utilizador, criando um novo se não existir
  async inicializarCarrinhoDoUtilizador() {
    await this.storage.create();

    const rawUser = await this.storage.get('utilizador');
    if (!rawUser) return;

    const utilizador = typeof rawUser === 'string' ? JSON.parse(rawUser) : rawUser;
    const userId = utilizador.id;

    this.apiService.get(`carrinhos/utilizador/${userId}`).subscribe({
      next: (carrinhos) => {
        if (!carrinhos || carrinhos.length === 0) {
          // Cria um novo carrinho se não existir
          this.apiService.post('/carrinhos', { utilizador_id: userId }).subscribe({
            next: async (novoCarrinho) => {
              await this.storage.set('carrinho_id', novoCarrinho.id);
              this.carregarCarrinho(novoCarrinho.id);
            }
          });
        } else {
          // Usa o carrinho existente
          const carrinho = carrinhos[0];
          this.storage.set('carrinho_id', carrinho.id);
          this.carregarCarrinho(carrinho.id);
        }
      }
    });
  }

  // Carrega os produtos do carrinho a partir do ID
  carregarCarrinho(carrinhoId: number) {
    this.apiService.get(`${ApiEndpoints.CARRINHO_PRODUTOS}/detalhes/${carrinhoId}`).subscribe(produtos => {
      this.cartItems = produtos;
      this.isEmpty = produtos.length === 0;

      // Para cada produto, carrega a imagem correspondente
      this.cartItems.forEach(prod => {
        this.apiService.getImageBlob(ApiEndpoints.PRODUTOS, prod.produto_id).subscribe({
          next: blob => {
            if (blob && blob.size > 0) {
              prod.imagem = this.sanitizer.bypassSecurityTrustUrl(
                URL.createObjectURL(blob)
              ) as string;
            } else {
              prod.imagem = 'assets/images/no_image.jpg';
            }
          },
          error: () => {
            prod.imagem = 'assets/images/no_image.jpg';
          }
        });
      });

      this.atualizarTotal();
    });
  }

  // Adiciona um produto ao carrinho ou atualiza a quantidade se já existir
  async adicionarProdutoAoCarrinho(produtoId: number, quantidade: number = 1) {
    const carrinhoId = await this.storage.get('carrinho_id');
    if (!carrinhoId) {
      console.error('Carrinho não encontrado');
      return;
    }

    const produtoExistente = this.cartItems.find(item => item.produto_id === produtoId);

    if (produtoExistente) {
      // Atualiza a quantidade do produto existente
      const novaQuantidade = produtoExistente.quantidade + quantidade;
      this.apiService.put(`${ApiEndpoints.CARRINHO_PRODUTOS}/${produtoExistente.id}`, { quantidade: novaQuantidade }).subscribe(() => {
        produtoExistente.quantidade = novaQuantidade;
        this.atualizarTotal();
      });
    } else {
      // Adiciona um novo produto ao carrinho
      this.apiService.post(`${ApiEndpoints.CARRINHO_PRODUTOS}`, {
        carrinho_id: carrinhoId,
        produto_id: produtoId,
        quantidade: quantidade
      }).subscribe(() => {
        this.carregarCarrinho(carrinhoId);
      });
    }
  }

  // Atualiza o valor total do carrinho
  atualizarTotal() {
    this.total = this.cartItems.reduce((sum, item) => {
      const preco = Number(item.preco);
      const quantidade = Number(item.quantidade);
      return isNaN(preco) || isNaN(quantidade) ? sum : sum + preco * quantidade;
    }, 0);
  }

  // Aumenta a quantidade de um item no carrinho
  increaseQuantity(item: any) {
    const novoItem = { quantidade: item.quantidade + 1 };
    this.apiService.put(`${ApiEndpoints.CARRINHO_PRODUTOS}/${item.id}`, novoItem).subscribe(() => {
      item.quantidade++;
      this.atualizarTotal();
    });
  }

  // Diminui a quantidade de um item ou pede confirmação para remover
  decreaseQuantity(item: any) {
    if (item.quantidade > 1) {
      const novoItem = { quantidade: item.quantidade - 1 };
      this.apiService.put(`${ApiEndpoints.CARRINHO_PRODUTOS}/${item.id}`, novoItem).subscribe(() => {
        item.quantidade--;
        this.atualizarTotal();
      });
    } else {
      this.confirmRemoveItem(item);
    }
  }

  // Mostra um alerta a pedir confirmação para remover um item do carrinho
  async confirmRemoveItem(item: any) {
    const alert = await this.alertController.create({
      header: 'Remover produto',
      message: `Tens a certeza que queres remover "${item.nome}" do carrinho?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
          handler: () => {
            console.log('Remoção cancelada');
          }
        },
        {
          text: 'Remover',
          cssClass: 'alert-button-confirm',
          handler: () => {
            this.removeItem(item);
          }
        }
      ]
    });

    await alert.present();
  }

  // Remove um item do carrinho
  removeItem(item: any) {
    this.apiService.delete(ApiEndpoints.CARRINHO_PRODUTOS, item.id).subscribe(() => {
      this.cartItems = this.cartItems.filter(p => p.id !== item.id);
      this.isEmpty = this.cartItems.length === 0;
      this.atualizarTotal();
    });
  }

  // Navega para a página de checkout se o carrinho não estiver vazio
  comprar() {
    if (!this.isEmpty) {
      this.router.navigate(['/stage1']);
    }
  }

  // Obtém o total de itens no carrinho
  obterTotalDeItens(): number {
    return this.cartItems.reduce((total, item) => {
      const quantidade = Number(item.quantidade);
      return total + (isNaN(quantidade) ? 0 : quantidade);
    }, 0);
  }
}
