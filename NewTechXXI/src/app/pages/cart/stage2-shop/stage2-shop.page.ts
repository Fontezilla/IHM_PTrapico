import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CheckoutService } from 'src/app/services/checkout-service/checkout-service.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-stage2-shop',
  templateUrl: './stage2-shop.page.html',
  styleUrls: ['./stage2-shop.page.scss'],
  standalone: false,
})
export class Stage2ShopPage implements OnInit {
  total: number = 0;
  searchText: string = '';
  selectedCity: string | null = null;

  // Lista de lojas disponíveis com suas informações
  cities = [
    { name: 'Lisboa', address: 'Rua Augusta, 100 - Centro Histórico', region: 'Grande Lisboa' },
    { name: 'Porto', address: 'Rua de Santa Catarina, 200 - Centro', region: 'Grande Porto' },
    { name: 'Coimbra', address: 'Largo da Portagem, 15 - Centro', region: 'Centro' },
    { name: 'Braga', address: 'Avenida da Liberdade, 50 - Centro', region: 'Norte' },
    { name: 'Faro', address: 'Rua Dr. Francisco Gomes, 30 - Centro', region: 'Algarve' },
    { name: 'Funchal', address: 'Avenida Arriaga, 80 - Centro', region: 'Madeira' },
    { name: 'Aveiro', address: 'Rua Dr. Lourenço Peixinho, 25 - Centro', region: 'Centro' },
    { name: 'Cascais', address: 'Rua Frederico Arouca, 10 - Centro', region: 'Grande Lisboa' },
    { name: 'Sintra', address: 'Praça da República, 5 - Centro Histórico', region: 'Grande Lisboa' },
    { name: 'Setúbal', address: 'Avenida Luísa Todi, 150 - Centro', region: 'Grande Lisboa' },
    { name: 'Vila Nova de Gaia', address: 'Rua Dr. Sousa Viterbo, 40 - Centro', region: 'Grande Porto' },
    { name: 'Guimarães', address: 'Largo do Toural, 20 - Centro Histórico', region: 'Norte' },
    { name: 'Viseu', address: 'Rua Direita, 60 - Centro', region: 'Centro' },
    { name: 'Évora', address: 'Praça do Giraldo, 8 - Centro Histórico', region: 'Alentejo' },
    { name: 'Viana do Castelo', address: 'Praça da República, 12 - Centro', region: 'Norte' }
  ];

  filteredCities = [...this.cities];

  constructor(
    private router: Router,
    private checkoutService: CheckoutService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.total = this.checkoutService.getTotal();
  }

  // Filtra a lista de lojas com base no texto de pesquisa
  filterCities() {
    const term = this.searchText.trim().toLowerCase();
    if (!term) {
      this.filteredCities = [...this.cities];
    } else {
      this.filteredCities = this.cities.filter(city =>
        city.name.toLowerCase().includes(term) ||
        city.region.toLowerCase().includes(term)
      );
    }
  }

  // Seleciona uma loja e guarda a sua morada
  selectCity(city: any) {
    this.selectedCity = city.name;
    this.checkoutService.setLojaMorada(`${city.name} - ${city.address}`);
  }

  // Valida e avança para a próxima etapa do checkout
  continuar() {
    if (!this.selectedCity) return;
    this.router.navigateByUrl('/stage3');
  }

  // Volta para a etapa anterior
  voltar() {
    this.navCtrl.back();
  }
}