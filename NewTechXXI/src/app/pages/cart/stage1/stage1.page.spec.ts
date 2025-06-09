// Importação dos módulos necessários para testes
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Stage1Page } from './stage1.page';

// Suite de testes para o componente Stage1Page
describe('Stage1Page', () => {
  // Variáveis para armazenar a instância do componente e o seu fixture
  let component: Stage1Page;
  let fixture: ComponentFixture<Stage1Page>;

  // Configuração inicial antes de cada teste
  beforeEach(() => {
    fixture = TestBed.createComponent(Stage1Page); // Cria uma instância do componente
    component = fixture.componentInstance; // Obtém a instância do componente
    fixture.detectChanges(); // Força a deteção de alterações
  });

  // Teste para verificar se o componente é criado com sucesso
  it('should create', () => {
    expect(component).toBeTruthy(); // Verifica se o componente existe
  });
});
