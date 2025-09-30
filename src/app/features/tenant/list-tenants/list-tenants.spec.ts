import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTenants } from './list-tenants';

describe('ListTenants', () => {
  let component: ListTenants;
  let fixture: ComponentFixture<ListTenants>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListTenants]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTenants);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
