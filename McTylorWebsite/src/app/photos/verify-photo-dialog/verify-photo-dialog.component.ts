import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../photos.component';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-verify-photo-dialog',
  templateUrl: './verify-photo-dialog.component.html',
  styleUrls: ['./verify-photo-dialog.component.scss']
})
export class VerifyPhotoDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<VerifyPhotoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close(true);
  }
}
