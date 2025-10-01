import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSubscriptionPlan } from './list-subscription-plan';

describe('ListSubscriptionPlan', () => {
  let component: ListSubscriptionPlan;
  let fixture: ComponentFixture<ListSubscriptionPlan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListSubscriptionPlan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSubscriptionPlan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
