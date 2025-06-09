// Importação dos módulos necessários para testes
import { ComponentFixture, TestBed } from '@angular/core/testing'; // Módulos para testes de componentes
import { Stage2HomePage } from './stage2.page'; // Importação do componente a ser testado

// Suite de testes para o componente Stage2Page
describe('Stage2Page', () => {
  let component: Stage2HomePage; // Instância do componente a ser testado
  let fixture: ComponentFixture<Stage2HomePage>; // Fixture para manipulação do componente

  // Configuração antes de cada teste
  beforeEach(() => {
    fixture = TestBed.createComponent(Stage2HomePage); // Cria uma instância do componente
    component = fixture.componentInstance; // Obtém a instância do componente
    fixture.detectChanges(); // Detecta mudanças no componente
  });

  // Teste para verificar se o componente é criado com sucesso
  it('should create', () => {
    expect(component).toBeTruthy(); // Esperamos que o componente exista
  });
});
