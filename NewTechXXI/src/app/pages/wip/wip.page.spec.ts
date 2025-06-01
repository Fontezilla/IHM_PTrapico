import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WipPage } from './wip.page';

describe('WipPage', () => {
  let component: WipPage;
  let fixture: ComponentFixture<WipPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WipPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
