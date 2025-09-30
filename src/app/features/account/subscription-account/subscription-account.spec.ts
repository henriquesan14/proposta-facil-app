import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionAccount } from './subscription-account';

describe('SubscriptionAccount', () => {
  let component: SubscriptionAccount;
  let fixture: ComponentFixture<SubscriptionAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionAccount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionAccount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
