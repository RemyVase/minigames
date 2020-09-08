import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListePartiesTictacComponent } from './liste-parties-tictac.component';

describe('ListePartiesTictacComponent', () => {
  let component: ListePartiesTictacComponent;
  let fixture: ComponentFixture<ListePartiesTictacComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListePartiesTictacComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListePartiesTictacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
