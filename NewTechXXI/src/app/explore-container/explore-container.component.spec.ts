// Importação dos módulos necessários para testes
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponent } from './explore-container.component';

// Suite de testes para o componente ExploreContainer
describe('ExploreContainerComponent', () => {
  let component: ExploreContainerComponent; // Instância do componente
  let fixture: ComponentFixture<ExploreContainerComponent>; // Fixture para testes

  // Configuração antes de cada teste
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExploreContainerComponent], // Declaração do componente
      imports: [IonicModule.forRoot()] // Importação do módulo Ionic
    }).compileComponents();

    fixture = TestBed.createComponent(ExploreContainerComponent); // Cria o componente
    component = fixture.componentInstance; // Obtém a instância
    fixture.detectChanges(); // Detecta mudanças
  });

  // Teste para verificar se o componente é criado corretamente
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
