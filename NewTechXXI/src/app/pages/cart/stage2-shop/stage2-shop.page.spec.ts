import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Stage2ShopPage } from './stage2-shop.page';

describe('Stage2ShopPage', () => {
  let component: Stage2ShopPage;
  let fixture: ComponentFixture<Stage2ShopPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Stage2ShopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
