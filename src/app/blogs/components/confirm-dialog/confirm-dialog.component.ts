import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface MatDialogData {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
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
