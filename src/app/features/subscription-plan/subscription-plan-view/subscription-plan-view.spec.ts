import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionPlanView } from './subscription-plan-view';

describe('SubscriptionPlanView', () => {
  let component: SubscriptionPlanView;
  let fixture: ComponentFixture<SubscriptionPlanView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionPlanView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionPlanView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
