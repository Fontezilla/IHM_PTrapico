import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Stage1Page } from './stage1.page';

describe('Stage1Page', () => {
  let component: Stage1Page;
  let fixture: ComponentFixture<Stage1Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Stage1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
