// Importação dos módulos necessários para testes
import { ComponentFixture, TestBed } from '@angular/core/testing'; // Módulos para testes de componentes
import { Stage2ShopPage } from './stage2-shop.page'; // Importação do componente a ser testado

// Suite de testes para o componente Stage2ShopPage
describe('Stage2ShopPage', () => {
  let component: Stage2ShopPage; // Instância do componente a ser testado
  let fixture: ComponentFixture<Stage2ShopPage>; // Fixture para manipulação do componente

  // Configuração antes de cada teste
  beforeEach(() => {
    fixture = TestBed.createComponent(Stage2ShopPage); // Cria uma instância do componente
    component = fixture.componentInstance; // Obtém a instância do componente
    fixture.detectChanges(); // Detecta mudanças no componente
  });

  // Teste para verificar se o componente é criado com sucesso
  it('should create', () => {
    expect(component).toBeTruthy(); // Esperamos que o componente exista
  });
});
