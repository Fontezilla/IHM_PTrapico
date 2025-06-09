import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  formMorada!: FormGroup;
  savedAddresses: any[] = [];
  selectedAddressId: number | null = null;
  isFormValid: boolean = false;
  utilizadorId!: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: ApiService,
    private storage: Storage,
    private checkoutService: CheckoutService,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    // Cria o FormGroup com validações
    this.formMorada = this.fb.group({
      rua: ['', Validators.required],
      codigoPostal: ['', Validators.required],
      cidade: ['', Validators.required],
      pais: ['', Validators.required]
    });

    // A cada mudança no formulário, revalida
    this.formMorada.valueChanges.subscribe(() => this.checkFormValidity());

    await this.inicializarUtilizadorEMoradas();
    this.total = this.checkoutService.getTotal();
  }

  private async inicializarUtilizadorEMoradas() {
    await this.storage.create();
    const rawUser = await this.storage.get('utilizador');
    if (!rawUser) {
      this.router.navigateByUrl('/login');
      return;
    }
    const user = typeof rawUser === 'string' ? JSON.parse(rawUser) : rawUser;
    this.utilizadorId = user.id;

    this.api
      .get(`${ApiEndpoints.MORADAS}/utilizador/${this.utilizadorId}`)
      .subscribe({
        next: (moradas) => (this.savedAddresses = moradas || []),
        error: () => (this.savedAddresses = [])
      });
  }

  // Verifica se há conflito ou se todos os campos estão preenchidos
  async checkFormValidity() {
    const { rua, codigoPostal, cidade, pais } = this.formMorada.value;
    const hasManualInput = !!(rua || codigoPostal || cidade || pais);

    if (this.selectedAddressId !== null && hasManualInput) {
      await this.presentAlert(
        'Já selecionaste uma morada guardada e preenches-te campos manualmente. Vamos limpar os dois para continuares.'
      );
      this.resetInputs();
      return;
    }

    this.isFormValid =
      this.selectedAddressId !== null ||
      !!(rua && codigoPostal && cidade && pais);
  }

  // Seleciona ou desseleciona morada guardada
  selectAddress(id: number) {
    this.selectedAddressId = this.selectedAddressId === id ? null : id;
    this.checkFormValidity();
  }

  // Continua para a próxima etapa
  async continuar() {
    const { rua, codigoPostal, cidade, pais } = this.formMorada.value;

    if (!this.isFormValid) {
      await this.presentAlert('Seleciona ou introduz uma morada.');
      return;
    }

    // Se escolheu morada já guardada
    if (this.selectedAddressId) {
      this.checkoutService.setMoradaId(this.selectedAddressId);
      this.router.navigateByUrl('/stage3');
      return;
    }

    // Se está a criar nova, evitar duplicados
    const normalizar = (s: string) => s.trim().toLowerCase();
    const existe = this.savedAddresses.some(addr =>
      normalizar(addr.rua) === normalizar(rua) &&
      normalizar(addr.codigo_postal) === normalizar(codigoPostal) &&
      normalizar(addr.cidade) === normalizar(cidade) &&
      normalizar(addr.pais) === normalizar(pais)
    );

    if (existe) {
      await this.presentAlert(
        'Morada já existente. Seleciona-a abaixo ou introduz outra.'
      );
      this.resetInputs();
      return;
    }

    // Submete nova morada
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
      error: async () => {
        await this.presentAlert('Erro ao criar morada. Tenta novamente.');
      }
    });
  }

  // Limpa formulário e seleção
  private resetInputs() {
    this.formMorada.reset();
    this.selectedAddressId = null;
    this.isFormValid = false;
  }

  private async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  goBack() {
    this.navCtrl.back();
  }
}
