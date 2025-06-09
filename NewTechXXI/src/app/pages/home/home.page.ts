import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiEndpoints } from 'src/app/services/api/api-endpoints.enum';
import { SearchHeaderComponent } from 'src/app/components/search-header/search-header.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

// Interface para representar um produto
interface Product {
  id: number;
  name: string;
  price: number;
  image: SafeUrl;
}

// Decorador que define o componente da página inicial
@Component({
  selector: 'app-home', // Seletor do componente
  templateUrl: './home.page.html', // Caminho para o template HTML
  styleUrls: ['./home.page.scss'], // Caminho para o ficheiro de estilos
  standalone: false // Indica que o componente não é independente
})
export class HomePage implements OnInit {
  // Lista de produtos em destaque
  featuredProducts: Product[] = [];
  // Lista de produtos recentes
  recentProducts: Product[] = [];
  // Controla se a barra de pesquisa está expandida
  searchExpanded = false;

  // Referência ao componente de pesquisa
  @ViewChild('searchBar') searchBar!: SearchHeaderComponent;

  // Injeção dos serviços necessários no construtor
  constructor(
    private api: ApiService, // Serviço para chamadas à API
    private sanitizer: DomSanitizer, // Serviço para sanitizar URLs de imagens
    private router: Router, // Serviço de navegação
    private alertController: AlertController // Serviço para mostrar alertas
  ) {}

  // Método chamado ao inicializar o componente
  ngOnInit(): void {
    this.loadProducts(); // Carrega os produtos em destaque e recentes
  }

  // Fecha/colapsa a barra de pesquisa
  collapseSearchBar() {
    this.searchBar?.collapseSearch();
  }

  // Carrega produtos em destaque e recentes da API
  private loadProducts(): void {
    // Produtos em destaque
    this.api.get(`${ApiEndpoints.PRODUTOS}/featured`).subscribe((produtos: any[]) => {
      const embaralhados = this.shuffleArray(produtos).slice(0, 4); // Seleciona 4 produtos aleatórios
      this.featuredProducts = [];

      embaralhados.forEach(p => {
        const prod: Product = {
          id: p.id,
          name: p.name ?? p.nome,
          price: p.price ?? p.preco,
          image: this.sanitizer.bypassSecurityTrustUrl('assets/images/no_image.jpg') // Imagem por defeito
        };

        // Tenta obter a imagem real do produto
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

    // Produtos recentes
    this.api.get(ApiEndpoints.PRODUTOS).subscribe((produtos: any[]) => {
      const ultimos = produtos.slice(-4); // Seleciona os 4 últimos produtos
      this.recentProducts = [];

      ultimos.forEach(p => {
        const prod: Product = {
          id: p.id,
          name: p.name ?? p.nome,
          price: p.price ?? p.preco,
          image: this.sanitizer.bypassSecurityTrustUrl('assets/images/no_image.jpg') // Imagem por defeito
        };

        // Tenta obter a imagem real do produto
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

  // Função utilitária para embaralhar um array (usada para produtos em destaque)
  private shuffleArray<T>(array: T[]): T[] {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  // Navega para uma página de "em desenvolvimento"
  navigateToWorkingOnIt(): void {
    console.log('Funcionalidade ainda não implementada');
  }

  // Mostra um alerta com título e mensagem
  async mostrarAlerta(titulo: string, mensagem: string): Promise<void> {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });

    await alert.present();
  }

  // Mostra alerta ao clicar em promoções
  onPromocoesClick() {
    this.mostrarAlerta('Promoções', 'Funcionalidade "Promoções" não implementada nesta versão.');
  }

  // Mostra alerta ao clicar em favoritos
  onFavoritosClick() {
    this.mostrarAlerta('Favoritos', 'Funcionalidade "Favoritos" não implementada nesta versão.');
  }

  // Mostra alerta ao clicar em compras
  onComprasClick() {
    this.mostrarAlerta('As Minhas Compras', 'Funcionalidade "As Minhas Compras" não implementada nesta versão.');
  }

  // Navega para a secção de serviços
  irParaServicos(): void {
    this.router.navigate(['/tabs/menu'], { queryParams: { tab: 'servicos' } });
  }

  // Anima o logo ao clicar (apenas log no console)
  animarLogo(event: Event): void {
    console.log('Logo clicado', event);
  }
}