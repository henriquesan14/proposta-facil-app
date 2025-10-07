import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TagAtivo } from './tag-ativo';


describe('TagAtivo', () => {
  let component: TagAtivo;
  let fixture: ComponentFixture<TagAtivo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagAtivo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagAtivo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
