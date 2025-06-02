import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiEndpoints } from 'src/app/services/api/api-endpoints.enum';
import { SearchHeaderComponent } from 'src/app/components/search-header/search-header.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

interface Product {
  id: number;
  name: string;
  price: number;
  image: SafeUrl;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  featuredProducts: Product[] = [];
  recentProducts: Product[] = [];
  searchExpanded = false;

  @ViewChild('searchBar') searchBar!: SearchHeaderComponent;

  constructor(
    private api: ApiService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  collapseSearchBar() {
    this.searchBar?.collapseSearch();
  }

  private loadProducts(): void {
    this.api.get(`${ApiEndpoints.PRODUTOS}/featured`).subscribe((produtos: any[]) => {
      const embaralhados = this.shuffleArray(produtos).slice(0, 4);
      this.featuredProducts = [];

      embaralhados.forEach(p => {
        const prod: Product = {
          id: p.id,
          name: p.name ?? p.nome,
          price: p.price ?? p.preco,
          image: this.sanitizer.bypassSecurityTrustUrl('assets/images/no_image.jpg')
        };

        this.api.getImageBlob(ApiEndpoints.PRODUTOS, p.id).subscribe({
          next: blob => {
            if (blob && blob.size > 0) {
              prod.image = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
            }
          },
          error: () => {}
        });

        this.featuredProducts.push(prod);
      });
    });

    this.api.get(ApiEndpoints.PRODUTOS).subscribe((produtos: any[]) => {
      const ultimos = produtos.slice(-4);
      this.recentProducts = [];

      ultimos.forEach(p => {
        const prod: Product = {
          id: p.id,
          name: p.name ?? p.nome,
          price: p.price ?? p.preco,
          image: this.sanitizer.bypassSecurityTrustUrl('assets/images/no_image.jpg')
        };

        this.api.getImageBlob(ApiEndpoints.PRODUTOS, p.id).subscribe({
          next: blob => {
            if (blob && blob.size > 0) {
              prod.image = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
            }
          },
          error: () => {}
        });

        this.recentProducts.push(prod);
      });
    });
  }

  private shuffleArray<T>(array: T[]): T[] {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  navigateToWorkingOnIt(): void {
    console.log('Funcionalidade ainda não implementada');
  }

  async mostrarAlerta(titulo: string, mensagem: string): Promise<void> {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });

    await alert.present();
  }

  onPromocoesClick() {
    this.mostrarAlerta('Promoções', 'Funcionalidade "Promoções" não implementada nesta versão.');
  }

  onFavoritosClick() {
    this.mostrarAlerta('Favoritos', 'Funcionalidade "Favoritos" não implementada nesta versão.');
  }

  onComprasClick() {
    this.mostrarAlerta('As Minhas Compras', 'Funcionalidade "As Minhas Compras" não implementada nesta versão.');
  }

  irParaServicos(): void {
    this.router.navigate(['/tabs/menu'], { queryParams: { tab: 'servicos' } });
  }

  animarLogo(event: Event): void {
    console.log('Logo clicado', event);
  }
}