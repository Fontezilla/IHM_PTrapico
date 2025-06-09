// Importação dos módulos necessários para testes
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartPage } from './cart.page';

// Suite de testes para o componente CartPage
describe('CartPage', () => {
  // Variáveis para armazenar a instância do componente e o seu fixture
  let component: CartPage;
  let fixture: ComponentFixture<CartPage>;

  // Configuração inicial antes de cada teste
  beforeEach(() => {
    fixture = TestBed.createComponent(CartPage); // Cria uma instância do componente
    component = fixture.componentInstance; // Obtém a instância do componente
    fixture.detectChanges(); // Força a deteção de alterações
  });

  // Teste para verificar se o componente é criado com sucesso
  it('should create', () => {
    expect(component).toBeTruthy(); // Verifica se o componente existe
  });
});
