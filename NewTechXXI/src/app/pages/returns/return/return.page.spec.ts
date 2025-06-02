import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReturnPage } from './return.page';

describe('ReturnPage', () => {
  let component: ReturnPage;
  let fixture: ComponentFixture<ReturnPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
