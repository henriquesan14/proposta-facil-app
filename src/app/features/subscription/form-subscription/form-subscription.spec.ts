import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSubscription } from './form-subscription';

describe('FormSubscription', () => {
  let component: FormSubscription;
  let fixture: ComponentFixture<FormSubscription>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSubscription]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormSubscription);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
