import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

interface MatDialogData {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: Observable<boolean>;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: MatDialogData,
    private readonly dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) {}

  onConfirm() {
    this.dialogData?.onConfirm?.();
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogData?.onCancel?.();
    this.dialogRef.close();
  }
}
