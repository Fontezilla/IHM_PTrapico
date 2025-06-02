import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Stage2HomePage } from './stage2.page';


describe('Stage2Page', () => {
  let component: Stage2HomePage;
  let fixture: ComponentFixture<Stage2HomePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Stage2HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
