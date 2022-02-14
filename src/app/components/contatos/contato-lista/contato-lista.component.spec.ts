import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContatoListaComponent } from './contato-lista.component';

describe('ContatoListaComponent', () => {
  let component: ContatoListaComponent;
  let fixture: ComponentFixture<ContatoListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContatoListaComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContatoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
