import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ApiEndpoints } from 'src/app/services/api-endpoints.enum';
import { Storage } from '@ionic/storage-angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-stage2',
  templateUrl: './stage2.page.html',
  styleUrls: ['./stage2.page.scss'],
  standalone: false
})
export class Stage2Page implements OnInit {
  morada = {
    rua: '',
    cidade: '',
    codigoPostal: '',
    pais: ''
  };

  total: number = 0;
  isFormValid: boolean = false;

  savedAddresses: any[] = [];
  selectedAddressId: number | null = null;
  userId: number = 0;

  constructor(
    private api: ApiService,
    private storage: Storage,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    await this.api.ensureReady();
    await this.storage.create();

    // Vai buscar o total do carrinho e o utilizador atual
    this.total = await this.storage.get('totalCarrinho');
    const utilizador = await this.storage.get('utilizador');
    this.userId = utilizador?.id;

    if (this.userId) {
      this.loadSavedAddresses(this.userId);
    }
  }

  // Vai buscar as moradas guardadas do utilizador
  loadSavedAddresses(userId: number) {
    this.api.get(`${ApiEndpoints.MORADAS}/utilizador/${userId}`).subscribe({
      next: (moradas) => {
        this.savedAddresses = moradas || [];
      },
      error: () => {
        this.savedAddresses = [];
      }
    });
  }

  // Quando se clica numa morada já guardada
  selectAddress(addressId: number) {
    this.selectedAddressId = addressId;
    this.isFormValid = true;
  }

  // Valida o formulário da nova morada
  checkFormValidity() {
    this.isFormValid =
      this.selectedAddressId !== null || (
        this.morada.rua.trim() !== '' &&
        this.morada.cidade.trim() !== '' &&
        this.morada.codigoPostal.trim() !== '' &&
        this.morada.pais.trim() !== ''
      );
  }

  // Quando se clica no botão "Continuar"
  async continuar() {
    if (this.selectedAddressId) {
      // Utilizador escolheu morada existente
      await this.storage.set('moradaId', this.selectedAddressId);
      this.navCtrl.navigateForward('/stage3');
    } else {
      // Criar nova morada
      const novaMorada = {
        utilizador_id: this.userId,
        rua: this.morada.rua.trim(),
        cidade: this.morada.cidade.trim(),
        codigo_postal: this.morada.codigoPostal.trim(),
        pais: this.morada.pais.trim()
      };

      this.api.post(ApiEndpoints.MORADAS, novaMorada).subscribe({
        next: async (res: any) => {
          const novaId = res?.id;
          if (novaId) {
            await this.storage.set('moradaId', novaId);
            this.navCtrl.navigateForward('/stage3');
          }
        },
        error: (err) => {
          console.error('Erro ao guardar morada:', err);
        }
      });
    }
  }

  // Voltar para o passo anterior
  goBack() {
    this.navCtrl.back();
  }
}