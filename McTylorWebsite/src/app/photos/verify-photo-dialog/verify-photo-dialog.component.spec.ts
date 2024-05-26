import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyPhotoDialogComponent } from './verify-photo-dialog.component';

describe('VerifyPhotoDialogComponent', () => {
  let component: VerifyPhotoDialogComponent;
  let fixture: ComponentFixture<VerifyPhotoDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerifyPhotoDialogComponent]
    });
    fixture = TestBed.createComponent(VerifyPhotoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
