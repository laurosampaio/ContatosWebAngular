import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContatosComponent } from './contatos.component';

describe('ContatosComponent', () => {
  let component: ContatosComponent;
  let fixture: ComponentFixture<ContatosComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ContatosComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ContatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
