import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiEndpoints } from 'src/app/services/api/api-endpoints.enum';
import { CheckoutService } from 'src/app/services/checkout-service/checkout-service.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-stage4',
  templateUrl: './stage4.page.html',
  styleUrls: ['./stage4.page.scss'],
  standalone: false   
})
export class Stage4Page {
  produtos: any[] = [];
  total = 0;
  localEntrega = '';
  metodoPagamento = '';
  tipoEntrega = '';
  morada: any = {};
  cartao: any = {};

  showDeliveryDetails = false;
  showPaymentDetails = false;

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private api: ApiService,
    private checkoutService: CheckoutService,
    private sanitizer: DomSanitizer,
    private storage: Storage
  ) {}

  async ionViewWillEnter() {
    await this.storage.create();
    this.produtos    = this.checkoutService.getProdutos();
    this.total       = this.checkoutService.getTotal();
    this.tipoEntrega = this.checkoutService.getTipoEntrega() || '';

    // Carrega local de entrega
    if (this.tipoEntrega === 'LOJA') {
      this.localEntrega = this.checkoutService.getLojaMorada() || 'Loja física';
    } else {
      this.localEntrega = 'Entrega em casa';
      const raw = await this.storage.get('utilizador');
      const u   = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (u?.id) {
        const mid = await this.checkoutService.getMoradaId();
        if (mid) {
          this.api.get(`${ApiEndpoints.MORADAS}/${mid}`)
            .subscribe({
              next: data => this.morada = data,
              error: ()   => this.morada = { rua: 'Erro ao carregar', codigoPostal: '', cidade: '', pais: '' }
            });
        }
      }
    }

    // Carrega método de pagamento
    const pay = this.checkoutService.getPagamento();
    this.metodoPagamento = pay?.metodo || '';
    this.cartao = this.parseCardData(pay?.dados || '');

    // Carrega imagens dos produtos
    this.produtos.forEach(p => {
      this.api.getImageBlob(ApiEndpoints.PRODUTOS, p.produtoId)
        .subscribe({
          next: blob => {
            p.imagem = blob.size
              ? (this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob)) as string)
              : 'assets/images/no_image.jpg';
          },
          error: () => p.imagem = 'assets/images/no_image.jpg'
        });
    });
  }

  private parseCardData(dados: string) {
    if (!dados) return {};
    const [nome, num, val, cvv] = dados.split(';');
    return { nomeTitular: nome, numeroCartao: num, validade: val, cvv };
  }

  toggleDelivery() { this.showDeliveryDetails = !this.showDeliveryDetails; }
  togglePayment()  { this.showPaymentDetails  = !this.showPaymentDetails; }

  atualizarCheckout() {
    const novo = this.produtos.reduce((s, p) => s + p.precoUnitario * p.quantidade, 0);
    this.checkoutService.setProdutos(this.produtos);
    this.checkoutService.setTotal(novo);
    this.total = novo;
  }

  increaseQuantity(prod: any) {
    const q = prod.quantidade + 1;
    this.api.put(`${ApiEndpoints.CARRINHO_PRODUTOS}/${prod.id}`, { quantidade: q })
      .subscribe(() => {
        prod.quantidade = q;
        this.atualizarCheckout();
      });
  }

  decreaseQuantity(prod: any) {
    if (prod.quantidade > 1) {
      const q = prod.quantidade - 1;
      this.api.put(`${ApiEndpoints.CARRINHO_PRODUTOS}/${prod.id}`, { quantidade: q })
        .subscribe(() => {
          prod.quantidade = q;
          this.atualizarCheckout();
        });
    } else {
      this.removeItem(prod);
    }
  }

  removeItem(prod: any) {
    this.api.delete(ApiEndpoints.CARRINHO_PRODUTOS, prod.id)
      .subscribe(() => {
        this.produtos = this.produtos.filter(p => p.id !== prod.id);
        this.atualizarCheckout();
      });
  }

  /** Limpa todos os itens do carrinho */
  private async clearCart(): Promise<void> {
    const raw = await this.storage.get('utilizador');
    const u   = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!u?.id) return;

    const carts: any[] = await lastValueFrom(
      this.api.get(`${ApiEndpoints.CARRINHOS}?utilizador_id=${u.id}`)
    );
    if (!carts.length) return;
    const cid = carts[0].id;

    const items: any[] = await lastValueFrom(
      this.api.get(`${ApiEndpoints.CARRINHO_PRODUTOS}?carrinho_id=${cid}`)
    );

    for (const it of items) {
      await lastValueFrom(this.api.delete(ApiEndpoints.CARRINHO_PRODUTOS, it.id));
    }
  }

  /** Conclui a compra e limpa o carrinho */
  concluir() {
    this.storage.get('utilizador').then(raw => {
      const u = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (!u?.id) {
        this.showToast('Utilizador não autenticado.', 'danger');
        return;
      }

      this.checkoutService
        .finalizarCompra(u.id, this.api)
        .then(obs$ => {
          obs$.subscribe({
            next: async () => {
              await this.clearCart();
              await this.showToast('Encomenda concluída com sucesso!', 'success');
              this.navCtrl.navigateForward('/finish');
            },
            error: async () => {
              await this.showToast('Erro ao concluir a encomenda.', 'danger');
            }
          });
        })
        .catch(err => {
          console.error('Erro ao chamar finalizarCompra():', err);
          this.showToast('Erro inesperado.', 'danger');
        });
    });
  }

  private async showToast(msg: string, color: 'success' | 'danger') {
    const t = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      color,
      position: 'bottom'
    });
    await t.present();
  }

  voltar() {
    this.navCtrl.back();
  }
}