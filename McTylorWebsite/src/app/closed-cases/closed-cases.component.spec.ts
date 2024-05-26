import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedCasesComponent } from './closed-cases.component';

describe('ClosedCasesComponent', () => {
  let component: ClosedCasesComponent;
  let fixture: ComponentFixture<ClosedCasesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClosedCasesComponent]
    });
    fixture = TestBed.createComponent(ClosedCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
