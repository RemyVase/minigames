import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListePartiesPenduComponent } from './liste-parties-pendu.component';

describe('ListePartiesPenduComponent', () => {
  let component: ListePartiesPenduComponent;
  let fixture: ComponentFixture<ListePartiesPenduComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListePartiesPenduComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListePartiesPenduComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
