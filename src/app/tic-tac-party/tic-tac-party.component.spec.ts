import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicTacPartyComponent } from './tic-tac-party.component';

describe('TicTacPartyComponent', () => {
  let component: TicTacPartyComponent;
  let fixture: ComponentFixture<TicTacPartyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicTacPartyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicTacPartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
