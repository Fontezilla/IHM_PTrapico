// Importação dos módulos necessários para testes
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetailsPage } from './product-details.page';

// Suite de testes para a página de detalhes do produto
describe('ProductDetailsPage', () => {
  // Variáveis para o componente e seu fixture
  let component: ProductDetailsPage;
  let fixture: ComponentFixture<ProductDetailsPage>;

  // Configuração antes de cada teste
  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Teste para verificar se o componente é criado com sucesso
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
