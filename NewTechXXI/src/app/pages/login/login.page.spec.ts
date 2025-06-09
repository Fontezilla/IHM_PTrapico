// Importação dos módulos necessários para testes
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';

// Descrição do conjunto de testes para o LoginPage
describe('LoginPage', () => {
  let component: LoginPage; // Instância do componente a ser testado
  let fixture: ComponentFixture<LoginPage>; // Fixture para aceder ao DOM e ao componente

  // Antes de cada teste, cria uma nova instância do componente
  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage); // Cria o componente
    component = fixture.componentInstance; // Obtém a instância do componente
    fixture.detectChanges(); // Deteta alterações e atualiza o DOM
  });

  // Teste para verificar se o componente é criado corretamente
  it('should create', () => {
    expect(component).toBeTruthy(); // Espera que o componente exista
  });
});
