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
  cartItems: any[] = [];
  total: number = 0;
  isEmpty: boolean = true;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private storage: Storage,
    private alertController: AlertController 
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    await this.inicializarCarrinhoDoUtilizador();
  }

  async inicializarCarrinhoDoUtilizador() {
    await this.storage.create();

    const rawUser = await this.storage.get('utilizador');
    if (!rawUser) return;

    const utilizador = typeof rawUser === 'string' ? JSON.parse(rawUser) : rawUser;
    const userId = utilizador.id;

    this.apiService.get(`carrinhos/utilizador/${userId}`).subscribe({
      next: (carrinhos) => {
        if (!carrinhos || carrinhos.length === 0) {
          this.apiService.post('/carrinhos', { utilizador_id: userId }).subscribe({
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
    this.apiService.get(`${ApiEndpoints.CARRINHO_PRODUTOS}/detalhes/${carrinhoId}`).subscribe(produtos => {
      this.cartItems = produtos;
      this.isEmpty = produtos.length === 0;

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

  atualizarTotal() {
    this.total = this.cartItems.reduce((sum, item) => {
      const preco = Number(item.preco);
      const quantidade = Number(item.quantidade);
      return isNaN(preco) || isNaN(quantidade) ? sum : sum + preco * quantidade;
    }, 0);
  }

  increaseQuantity(item: any) {
    const novoItem = { quantidade: item.quantidade + 1 };
    this.apiService.put(`${ApiEndpoints.CARRINHO_PRODUTOS}/${item.id}`, novoItem).subscribe(() => {
      item.quantidade++;
      this.atualizarTotal();
    });
  }

  decreaseQuantity(item: any) {
    if (item.quantidade > 1) {
      const novoItem = { quantidade: item.quantidade - 1 };
      this.apiService.put(`${ApiEndpoints.CARRINHO_PRODUTOS}/${item.id}`, novoItem).subscribe(() => {
        item.quantidade--;
        this.atualizarTotal();
      });
    } else {
      // Chamar confirmação em vez de remover diretamente
      this.confirmRemoveItem(item);
    }
  }

 // Método de confirmação antes de remover
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

removeItem(item: any) {
  this.apiService.delete(ApiEndpoints.CARRINHO_PRODUTOS, item.id).subscribe(() => {
    this.cartItems = this.cartItems.filter(p => p.id !== item.id);
    this.isEmpty = this.cartItems.length === 0;
    this.atualizarTotal();
  });
}


  comprar() {
    if (!this.isEmpty) {
      this.router.navigate(['/stage1']);
    }
  }

  obterTotalDeItens(): number {
    return this.cartItems.reduce((total, item) => {
      const quantidade = Number(item.quantidade);
      return total + (isNaN(quantidade) ? 0 : quantidade);
    }, 0);
  }
}
