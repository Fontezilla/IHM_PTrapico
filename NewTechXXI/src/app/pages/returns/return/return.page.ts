import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiEndpoints } from 'src/app/services/api/api-endpoints.enum';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface Product {
  id: number;
  name: string;
  price: number;
  image: SafeUrl;
}

@Component({
  selector: 'app-return',
  templateUrl: './return.page.html',
  styleUrls: ['./return.page.scss'],
  standalone: false
})
export class ReturnPage implements OnInit {
  recentProducts: Product[] = [];
  selectedProduct: Product | null = null; // <- Voltar a adicionar

  constructor(
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.apiService.get(ApiEndpoints.PRODUTOS).subscribe((products: any[]) => {
      const recentProducts = products.slice(-3);
      this.recentProducts = [];

      recentProducts.forEach(p => {
        const prod: Product = {
          id: p.id,
          name: p.name ?? p.nome,
          price: p.price ?? p.preco,
          image: this.sanitizer.bypassSecurityTrustUrl('assets/images/no_image.jpg')
        };

        this.apiService.getImageBlob(ApiEndpoints.PRODUTOS, p.id).subscribe({
          next: blob => {
            if (blob && blob.size > 0) {
              prod.image = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
            }
          },
          error: () => {
            console.error('Erro ao carregar imagem do produto');
          }
        });

        this.recentProducts.push(prod);
      });
    });
  }

  selectProduct(product: Product) {
    this.selectedProduct = product;
  }

  proceedToDetails() {
    // Navegar para página de detalhes só quando clica "Seguinte"
    if (this.selectedProduct) {
      this.router.navigate(['/return-details'], {
        state: { selectedProduct: this.selectedProduct }
      });
    }
  }

  voltar() {
    this.location.back();
  }
}