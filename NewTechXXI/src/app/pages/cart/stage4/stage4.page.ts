import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiEndpoints } from 'src/app/services/api/api-endpoints.enum';
import { CheckoutService } from 'src/app/services/checkout-service/checkout-service.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-stage4',
  templateUrl: './stage4.page.html',
  styleUrls: ['./stage4.page.scss'],
  standalone: false,
})
export class Stage4Page {
  produtos: any[] = [];
  total: number = 0;
  localEntrega: string = '';
  metodoPagamento: string = '';
  tipoEntrega: string = '';
  morada: any = {};
  cartao: any = {};

  showDeliveryDetails = false;
  showPaymentDetails = false;

  constructor(
    private navCtrl: NavController,
    private toastController: ToastController,
    private apiService: ApiService,
    private checkoutService: CheckoutService,
    private sanitizer: DomSanitizer,
    private storage: Storage
  ) {}

  async ionViewWillEnter() {
    await this.storage.create();

    this.produtos = this.checkoutService.getProdutos();
    this.total = this.checkoutService.getTotal();
    this.tipoEntrega = this.checkoutService.getTipoEntrega() || '';

    if (this.tipoEntrega === 'LOJA') {
      this.localEntrega = this.checkoutService.getLojaMorada() || 'Loja física';
    } else if (this.tipoEntrega === 'MORADA') {
      this.localEntrega = 'Entrega em casa';

      const raw = await this.storage.get('utilizador');
      const utilizador = typeof raw === 'string' ? JSON.parse(raw) : raw;
      const utilizadorId = utilizador?.id;

      if (utilizadorId) {
        const moradaId = await this.checkoutService.getMoradaId();
        console.log('[DEBUG STAGE4] Morada ID do checkout:', moradaId);

        if (moradaId) {
          this.apiService.get(`${ApiEndpoints.MORADAS}/${moradaId}`).subscribe({
            next: (data) => {
              console.log('[DEBUG STAGE4] Morada carregada:', data);
              this.morada = data;
            },
            error: (err) => {
              console.error('[ERRO STAGE4] Falha ao obter morada por ID:', err);
              this.morada = {
                rua: 'Erro ao carregar morada',
                codigoPostal: '',
                cidade: '',
                pais: '',
              };
            }
          });
        } else {
          console.warn('[DEBUG STAGE4] Nenhum moradaId disponível no CheckoutService');
          this.morada = {
            rua: 'Nenhuma morada selecionada',
            codigoPostal: '',
            cidade: '',
            pais: '',
          };
        }
      } else {
        this.morada = {
          rua: 'Utilizador não autenticado',
          codigoPostal: '',
          cidade: '',
          pais: '',
        };
      }
    }

    const pagamento = this.checkoutService.getPagamento();
    this.metodoPagamento = pagamento?.metodo || '';
    this.cartao = this.parseCardData(pagamento?.dados || '');

    this.produtos.forEach(prod => {
      this.apiService.getImageBlob(ApiEndpoints.PRODUTOS, prod.produtoId).subscribe({
        next: blob => {
          prod.imagem = blob && blob.size > 0
            ? this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob)) as string
            : 'assets/images/no_image.jpg';
        },
        error: () => {
          prod.imagem = 'assets/images/no_image.jpg';
        }
      });
    });
  }

  parseCardData(dados: string): any {
    if (!dados) return {};
    const [nomeTitular, numeroCartao, validade, cvv] = dados.split(';');
    return { nomeTitular, numeroCartao, validade, cvv };
  }

  toggleDelivery() {
    this.showDeliveryDetails = !this.showDeliveryDetails;
  }

  togglePayment() {
    this.showPaymentDetails = !this.showPaymentDetails;
  }

  atualizarCheckout() {
    const novoTotal = this.produtos.reduce((acc, p) => acc + p.precoUnitario * p.quantidade, 0);
    this.checkoutService.setProdutos(this.produtos);
    this.checkoutService.setTotal(novoTotal);
    this.total = novoTotal;
  }

  increaseQuantity(produto: any) {
    const novaQuantidade = produto.quantidade + 1;

    this.apiService.put(`${ApiEndpoints.CARRINHO_PRODUTOS}/${produto.id}`, { quantidade: novaQuantidade }).subscribe(() => {
      produto.quantidade = novaQuantidade;
      this.atualizarCheckout();
    });
  }

  decreaseQuantity(produto: any) {
    if (produto.quantidade > 1) {
      const novaQuantidade = produto.quantidade - 1;

      this.apiService.put(`${ApiEndpoints.CARRINHO_PRODUTOS}/${produto.id}`, { quantidade: novaQuantidade }).subscribe(() => {
        produto.quantidade = novaQuantidade;
        this.atualizarCheckout();
      });
    } else {
      this.removeItem(produto);
    }
  }

  removeItem(produto: any) {
    this.apiService.delete(ApiEndpoints.CARRINHO_PRODUTOS, produto.id).subscribe(() => {
      this.produtos = this.produtos.filter(p => p.id !== produto.id);
      this.atualizarCheckout();
    });
  }

  async concluir() {
    try {
      const raw = await this.storage.get('utilizador');
      const utilizador = typeof raw === 'string' ? JSON.parse(raw) : raw;
      const utilizadorId = utilizador?.id;

      if (!utilizadorId) {
        await this.showToast('Utilizador não autenticado.', 'danger');
        return;
      }

      const result$ = await this.checkoutService.finalizarCompra(utilizadorId, this.apiService);
      result$.subscribe({
        next: async () => {
          await this.showToast('Encomenda concluída com sucesso!', 'success');
          this.navCtrl.navigateForward('/finish');
        },
        error: async () => {
          await this.showToast('Erro ao concluir a encomenda.', 'danger');
        }
      });
    } catch (e) {
      console.error('[ERRO CONCLUIR]', e);
      await this.showToast('Erro inesperado.', 'danger');
    }
  }

  async showToast(msg: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }

  voltar() {
    this.navCtrl.back();
  }
}