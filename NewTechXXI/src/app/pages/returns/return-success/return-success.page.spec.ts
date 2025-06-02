import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReturnSuccessPage } from './return-success.page';

describe('ReturnSuccessPage', () => {
  let component: ReturnSuccessPage;
  let fixture: ComponentFixture<ReturnSuccessPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnSuccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
