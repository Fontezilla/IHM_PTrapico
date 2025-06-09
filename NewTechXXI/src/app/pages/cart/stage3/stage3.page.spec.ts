// Importação dos módulos necessários para testes
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Stage3Page } from './stage3.page'; // Importação do componente a ser testado

// Suite de testes para o componente Stage3Page
describe('Stage3Page', () => {
  let component: Stage3Page; // Instância do componente
  let fixture: ComponentFixture<Stage3Page>; // Fixture para manipulação do componente

  // Configuração antes de cada teste
  beforeEach(() => {
    fixture = TestBed.createComponent(Stage3Page); // Cria uma instância do componente
    component = fixture.componentInstance; // Obtém a instância do componente
    fixture.detectChanges(); // Força a detecção de mudanças
  });

  // Teste que verifica se o componente é criado com sucesso
  it('should create', () => {
    expect(component).toBeTruthy(); // Verifica se o componente foi criado
  });
});
