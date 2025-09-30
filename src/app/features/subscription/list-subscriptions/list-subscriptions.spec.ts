import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSubscriptions } from './list-subscriptions';

describe('ListSubscriptions', () => {
  let component: ListSubscriptions;
  let fixture: ComponentFixture<ListSubscriptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListSubscriptions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSubscriptions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
