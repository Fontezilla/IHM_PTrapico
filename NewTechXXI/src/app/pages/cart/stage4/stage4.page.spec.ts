// Importação dos módulos necessários para testes
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Stage4Page } from './stage4.page'; // Importação do componente a ser testado

// Suite de testes para o componente Stage4Page
describe('Stage4Page', () => {
  let component: Stage4Page; // Instância do componente
  let fixture: ComponentFixture<Stage4Page>; // Fixture para manipulação do componente

  // Configuração antes de cada teste
  beforeEach(() => {
    fixture = TestBed.createComponent(Stage4Page); // Cria uma instância do componente
    component = fixture.componentInstance; // Obtém a instância do componente
    fixture.detectChanges(); // Força a detecção de mudanças
  });

  // Teste que verifica se o componente é criado com sucesso
  it('should create', () => {
    expect(component).toBeTruthy(); // Verifica se o componente foi criado
  });
});
