import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProposal } from './form-proposal';

describe('FormProposal', () => {
  let component: FormProposal;
  let fixture: ComponentFixture<FormProposal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormProposal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormProposal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
