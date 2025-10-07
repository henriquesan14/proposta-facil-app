import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionView } from './subscription-view';

describe('SubscriptionView', () => {
  let component: SubscriptionView;
  let fixture: ComponentFixture<SubscriptionView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
