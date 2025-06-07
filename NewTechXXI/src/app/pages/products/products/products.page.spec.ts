// Importação dos módulos necessários para testes
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsPage } from './products.page'; // Importa o componente da página de produtos

// Suite de testes para o componente ProductsPage
describe('ProductsPage', () => {
  // Variáveis para armazenar a instância do componente e o seu fixture
  let component: ProductsPage;
  let fixture: ComponentFixture<ProductsPage>;

  // Configuração inicial antes de cada teste
  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsPage); // Cria uma instância do componente
    component = fixture.componentInstance; // Obtém a instância do componente
    fixture.detectChanges(); // Força a deteção de alterações
  });

  // Teste para verificar se o componente é criado com sucesso
  it('should create', () => {
    expect(component).toBeTruthy(); // Verifica se o componente existe
  });
});
