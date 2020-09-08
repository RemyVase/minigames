import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutPartieTictacComponent } from './ajout-partie-tictac.component';

describe('AjoutPartieTictacComponent', () => {
  let component: AjoutPartieTictacComponent;
  let fixture: ComponentFixture<AjoutPartieTictacComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AjoutPartieTictacComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AjoutPartieTictacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
