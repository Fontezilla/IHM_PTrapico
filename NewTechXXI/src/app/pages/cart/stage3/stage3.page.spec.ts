import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Stage3Page } from './stage3.page';

describe('Stage3Page', () => {
  let component: Stage3Page;
  let fixture: ComponentFixture<Stage3Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Stage3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
