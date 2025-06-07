import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiEndpoints } from 'src/app/services/api/api-endpoints.enum';
import { Storage } from '@ionic/storage-angular';
import { CheckoutService } from 'src/app/services/checkout-service/checkout-service.service';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-stage2-home',
  templateUrl: './stage2-home.page.html',
  styleUrls: ['./stage2-home.page.scss'],
  standalone: false,
})
export class Stage2HomePage implements OnInit {
  total: number = 0;

  morada = {
    rua: '',
    codigoPostal: '',
    cidade: '',
    pais: ''
  };

  savedAddresses: any[] = [];
  selectedAddressId: number | null = null;
  isFormValid: boolean = false;
  utilizadorId!: number;

  constructor(
    private router: Router,
    private api: ApiService,
    private storage: Storage,
    private checkoutService: CheckoutService,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    await this.inicializarUtilizadorEMoradas();
    this.total = this.checkoutService.getTotal();
  }

  // Inicializa utilizador e moradas guardadas
  async inicializarUtilizadorEMoradas() {
    await this.storage.create();
    const rawUser = await this.storage.get('utilizador');
    if (!rawUser) {
      this.router.navigateByUrl('/login');
      return;
    }

    const user = typeof rawUser === 'string' ? JSON.parse(rawUser) : rawUser;
    this.utilizadorId = user.id;

    this.api.get(`${ApiEndpoints.MORADAS}/utilizador/${this.utilizadorId}`).subscribe({
      next: (moradas) => {
        this.savedAddresses = moradas || [];
      },
      error: () => {
        this.savedAddresses = [];
      }
    });
  }

  // Verifica validade do formulário e conflito
  async checkFormValidity() {
    const { rua, codigoPostal, cidade, pais } = this.morada;
    const hasManualInput = !!(rua || codigoPostal || cidade || pais);

    if (this.selectedAddressId !== null && hasManualInput) {
      await this.presentAlert('Já selecionaste uma morada guardada e preenches-te campos manualmente. Vamos limpar os dois para continuares.');
      this.resetInputs(); // só após fechar o alerta
      return;
    }

    this.isFormValid =
      this.selectedAddressId !== null ||
      !!(rua && codigoPostal && cidade && pais);
  }


  // Seleciona ou desseleciona morada guardada
  selectAddress(id: number) {
    if (this.selectedAddressId === id) {
      // Desseleciona se clicar de novo
      this.selectedAddressId = null;
    } else {
      this.selectedAddressId = id;
    }

    this.checkFormValidity();
  }

  // Avança para etapa seguinte com morada válida
  async continuar() {
    const { rua, codigoPostal, cidade, pais } = this.morada;

    if (!this.selectedAddressId && !(rua && codigoPostal && cidade && pais)) {
      this.presentAlert('Seleciona ou introduz uma morada.');
      return;
    }

    if (this.selectedAddressId) {
      this.checkoutService.setMoradaId(this.selectedAddressId);
      this.router.navigateByUrl('/stage3');
      return;
    }

    // Verificar duplicado
    const normalizar = (str: string) => str.trim().toLowerCase();
    const existe = this.savedAddresses.some(addr =>
      normalizar(addr.rua) === normalizar(rua) &&
      normalizar(addr.codigo_postal) === normalizar(codigoPostal) &&
      normalizar(addr.cidade) === normalizar(cidade) &&
      normalizar(addr.pais) === normalizar(pais)
    );

    if (existe) {
      this.presentAlert('Morada já existente. Seleciona-a abaixo ou introduz outra.');
      this.resetInputs();
      return;
    }

    // Submeter nova morada
    const payload = {
      utilizador_id: this.utilizadorId,
      rua,
      cidade,
      codigo_postal: codigoPostal,
      pais
    };

    this.api.post(ApiEndpoints.MORADAS, payload).subscribe({
      next: (novaMorada) => {
        this.checkoutService.setMoradaId(novaMorada.id);
        this.router.navigateByUrl('/stage3');
      },
      error: () => {
        this.presentAlert('Erro ao criar morada. Tenta novamente.');
      }
    });
  }

  // Reset a inputs e morada selecionada
  resetInputs() {
    this.morada = { rua: '', codigoPostal: '', cidade: '', pais: '' };
    this.selectedAddressId = null;
    this.isFormValid = false;
  }

  // Mostra alerta com mensagem de erro
  async presentAlert(msg: string) {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Voltar para etapa anterior
  goBack() {
    this.navCtrl.back();
  }
}
