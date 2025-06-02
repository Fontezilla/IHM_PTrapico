import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Stage2Page } from './stage2.page';

describe('Stage2Page', () => {
  let component: Stage2Page;
  let fixture: ComponentFixture<Stage2Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Stage2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
