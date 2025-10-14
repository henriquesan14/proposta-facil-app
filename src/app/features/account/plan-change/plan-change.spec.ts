import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanChange } from './plan-change';

describe('PlanChange', () => {
  let component: PlanChange;
  let fixture: ComponentFixture<PlanChange>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanChange]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanChange);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
