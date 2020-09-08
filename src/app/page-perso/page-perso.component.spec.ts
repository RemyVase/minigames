import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePersoComponent } from './page-perso.component';

describe('PagePersoComponent', () => {
  let component: PagePersoComponent;
  let fixture: ComponentFixture<PagePersoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagePersoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagePersoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
