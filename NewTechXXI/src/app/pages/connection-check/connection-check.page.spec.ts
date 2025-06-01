import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConnectionCheckPage } from './connection-check.page';

describe('ConnectionCheckPage', () => {
  let component: ConnectionCheckPage;
  let fixture: ComponentFixture<ConnectionCheckPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionCheckPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
