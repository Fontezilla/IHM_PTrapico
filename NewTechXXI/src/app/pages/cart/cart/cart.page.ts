import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ApiEndpoints } from 'src/app/services/api-endpoints.enum';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: false,
})
export class CartPage implements OnInit {
  cartItems: any[] = [];
  total: number = 0;
  isEmpty: boolean = true;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.carregarCarrinho();
  }

  carregarCarrinho() {
    this.apiService.get(ApiEndpoints.CARRINHO_PRODUTOS).subscribe(produtos => {
      this.cartItems = produtos;
      this.isEmpty = produtos.length === 0;
      this.atualizarTotal();
    });
  }

  atualizarTotal() {
    this.total = this.cartItems.reduce(
      (sum, item) => sum + item.preco * item.quantidade,
      0
    );
  }

  increaseQuantity(item: any) {
    const novoItem = { ...item, quantidade: item.quantidade + 1 };
    this.apiService.put(ApiEndpoints.CARRINHO_PRODUTOS, novoItem).subscribe(() => {
      item.quantidade++;
      this.atualizarTotal();
    });
  }

  decreaseQuantity(item: any) {
    if (item.quantidade > 1) {
      const novoItem = { ...item, quantidade: item.quantidade - 1 };
      this.apiService.put(ApiEndpoints.CARRINHO_PRODUTOS, novoItem).subscribe(() => {
        item.quantidade--;
        this.atualizarTotal();
      });
    } else {
      this.removeItem(item);
    }
  }

  removeItem(item: any) {
    this.apiService.delete(ApiEndpoints.CARRINHO_PRODUTOS, item.id).subscribe(() => {
      this.cartItems = this.cartItems.filter(p => p.id !== item.id);
      this.isEmpty = this.cartItems.length === 0;
      this.atualizarTotal();
    });
  }

  comprar() {
    if (!this.isEmpty) {
      this.router.navigate(['/tabs/cart/etapa1']);
    }
  }
}