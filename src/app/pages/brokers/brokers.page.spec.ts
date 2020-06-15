import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokersPage } from './brokers.page';

describe('BrokersPage', () => {
  let component: BrokersPage;
  let fixture: ComponentFixture<BrokersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
