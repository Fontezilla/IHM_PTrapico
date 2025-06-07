import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CheckoutService } from 'src/app/services/checkout-service/checkout-service.service';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-stage3',
  templateUrl: './stage3.page.html',
  styleUrls: ['./stage3.page.scss'],
  standalone: false
})
export class Stage3Page {
  total: number = 0;
  selectedPayment: string = '';
  showCardForm: boolean = false;
  formCartao!: FormGroup;
  isContinueEnabled: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private checkoutService: CheckoutService,
    private navCtrl: NavController
  ) {}

  ionViewWillEnter() {
    this.total = this.checkoutService.getTotal();
    this.selectedPayment = '';
    this.showCardForm = false;
    this.isContinueEnabled = false;

    this.formCartao = this.fb.group({
      nomeTitular: ['', [ Validators.required, Validators.pattern(/^[A-Za-zÀ-ÿ\s]+$/) ]],
      numeroCartao: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      validade: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
    });
  }

  selectPayment(metodo: string) {
    this.selectedPayment = metodo;
    this.showCardForm = false;
    this.isContinueEnabled = true;
  }

  continuar() {
    if (this.selectedPayment === 'cartao') {
      if (!this.showCardForm) {
        this.showCardForm = true;
        return;
      }

      if (this.formCartao.valid) {
        this.checkoutService.setPagamento({
          metodo: this.selectedPayment,
          dados: this.stringifyCartao(),
        });
        this.router.navigate(['/stage4']);
      } else {
        this.mostrarAlerta('Erro', 'Preencha todos os dados do cartão corretamente.');
      }
      return;
    }

    this.mostrarAlerta('Pagamento', 'Funcionalidade de pagamento com este método ainda não está implementada.');
  }

  formatExpiryDate() {
    const valor = this.formCartao.get('validade')?.value;
    if (valor.length === 2 && !valor.includes('/')) {
      this.formCartao.patchValue({ validade: valor + '/' });
    }
  }

  stringifyCartao(): string {
    const { nomeTitular, numeroCartao, validade, cvv } = this.formCartao.value;
    return `${nomeTitular};${numeroCartao};${validade};${cvv}`;
  }

  async mostrarAlerta(titulo: string, mensagem: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK'],
    });
    await alert.present();
  }

  voltar() {
    this.navCtrl.back();
  }
}