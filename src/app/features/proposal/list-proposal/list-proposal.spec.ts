import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProposal } from './list-proposal';

describe('ListProposal', () => {
  let component: ListProposal;
  let fixture: ComponentFixture<ListProposal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListProposal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListProposal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
