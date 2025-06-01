import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConnectionSettingsPage } from './connection-settings.page';

describe('ConnectionSettingsPage', () => {
  let component: ConnectionSettingsPage;
  let fixture: ComponentFixture<ConnectionSettingsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
