import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Stage4Page } from './stage4.page';

describe('Stage4Page', () => {
  let component: Stage4Page;
  let fixture: ComponentFixture<Stage4Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Stage4Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
