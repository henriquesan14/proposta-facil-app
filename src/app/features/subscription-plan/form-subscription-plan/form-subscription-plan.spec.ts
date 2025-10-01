import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSubscriptionPlan } from './form-subscription-plan';

describe('FormSubscriptionPlan', () => {
  let component: FormSubscriptionPlan;
  let fixture: ComponentFixture<FormSubscriptionPlan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSubscriptionPlan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormSubscriptionPlan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
