import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CheckoutService } from 'src/app/services/checkout-service/checkout-service.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-stage3',
  templateUrl: './stage3.page.html',
  styleUrls: ['./stage3.page.scss'],
  standalone: false,
})
export class Stage3Page {
  total: number = 0;
  selectedPayment: string = '';
  showCardForm: boolean = false;
  isStepValid: boolean = false;
  clickCount: number = 0;

  cartao = {
    nomeTitular: '',
    numeroCartao: '',
    validade: '',
    cvv: ''
  };

  constructor(
    private router: Router,
    private alertController: AlertController,
    private checkoutService: CheckoutService,
    private navCtrl: NavController
  ) {}

  ionViewWillEnter() {
    this.total = this.checkoutService.getTotal();
    this.selectedPayment = '';
    this.showCardForm = false;
    this.isStepValid = false;
    this.clickCount = 0;
    this.cartao = {
      nomeTitular: '',
      numeroCartao: '',
      validade: '',
      cvv: ''
    };
  }

  selectPayment(metodo: string) {
    this.selectedPayment = metodo;
    this.isStepValid = true;
  }

  continuar() {
    this.clickCount++;

    if (this.selectedPayment === 'cartao') {
      if (this.clickCount === 1) {
        this.showCardForm = true;
        return;
      }

      if (this.clickCount === 2) {
        this.checkoutService.setPagamento({
          metodo: this.selectedPayment,
          dados: this.stringifyCartao()

        });
        this.router.navigate(['/stage4']);
        return;
      }
    }

    if (this.clickCount === 1) {
      this.mostrarAlerta('Pagamento', 'Funcionalidade de pagamento com este método ainda não está implementada.');
      this.clickCount = 0;
    }
  }

  formatExpiryDate() {
    if (this.cartao.validade.length === 2 && !this.cartao.validade.includes('/')) {
      this.cartao.validade = this.cartao.validade + '/';
    }
  }

  checkStepValidity() {
    this.isStepValid =
      !!this.cartao.nomeTitular &&
      !!this.cartao.numeroCartao &&
      !!this.cartao.validade &&
      !!this.cartao.cvv;
  }

  async mostrarAlerta(titulo: string, mensagem: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK'],
    });
    await alert.present();
  }

  stringifyCartao(): string {
    const { nomeTitular, numeroCartao, validade, cvv } = this.cartao;
    return `${nomeTitular};${numeroCartao};${validade};${cvv}`;
  }

  voltar() {
    this.navCtrl.back();
  }
}
