// Importação dos módulos necessários para testes
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';

// Descrição do conjunto de testes para o HomePage
describe('HomePage', () => {
  let component: HomePage; // Instância do componente a ser testado
  let fixture: ComponentFixture<HomePage>; // Fixture para aceder ao DOM e ao componente

  // Antes de cada teste, cria uma nova instância do componente
  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage); // Cria o componente
    component = fixture.componentInstance; // Obtém a instância do componente
    fixture.detectChanges(); // Deteta alterações e atualiza o DOM
  });

  // Teste para verificar se o componente é criado corretamente
  it('should create', () => {
    expect(component).toBeTruthy(); // Espera que o componente exista
  });
});
