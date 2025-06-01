import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ApiEndpoints } from 'src/app/services/api-endpoints.enum';
import { ViewChild } from '@angular/core';
import { SearchHeaderComponent } from 'src/app/components/search-header/search-header.component';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
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

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  @ViewChild('searchBar') searchBar!: SearchHeaderComponent;

  collapseSearchBar() {
    this.searchBar.collapseSearch();
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
          image: ''
        };
        this.api.getImageBlob(ApiEndpoints.PRODUTOS, p.id).subscribe(blob => {
          prod.image = URL.createObjectURL(blob);
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
          image: ''
        };
        this.api.getImageBlob(ApiEndpoints.PRODUTOS, p.id).subscribe(blob => {
          prod.image = URL.createObjectURL(blob);
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

  irParaServicos(): void {
    console.log('Ir para serviços');
  }

  animarLogo(event: Event): void {
    console.log('Logo clicado', event);
  }
}
