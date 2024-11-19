import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { TooltipModule } from 'primeng/tooltip';
import { Receipt } from '../../models/receiptDTO';
import { isDialogOpen } from '../../store/actions/modal.actions';
import { submitReceipt } from '../../store/actions/receipt.action';
import { selectIsModalOpen } from '../../store/selectors/modal.selector';
import {
  selectReceiptError,
  selectReceiptSuccess,
} from '../../store/selectors/receipt.selector';

@Component({
  selector: 'app-receipts',
  standalone: true,
  imports: [
    DialogModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    MessagesModule,
    TooltipModule,
  ],
  templateUrl: './receipts.component.html',
  styleUrl: './receipts.component.scss',
})
export class ReceiptsComponent {
  receiptForm: FormGroup;
  store = inject(Store);
  visible = this.store.selectSignal(selectIsModalOpen);
  errorMessage = this.store.select(selectReceiptError);
  isSuccess = this.store.select(selectReceiptSuccess);
  messages: Message[] = [];
  fb = inject(FormBuilder);
  constructor() {
    this.receiptForm = this.fb.group({
      company: ['', Validators.required],
      streetAddress: ['', Validators.required],
      cityZipCode: ['', Validators.required],
      website: ['', [Validators.required, Validators.pattern('https?://.+')]],
      dateTime: ['', Validators.required],
      productName: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.errorMessage.subscribe((error: any) => {
      if (error) {
        this.messages = [{ severity: 'error', detail: error.message }];
      } else {
        this.messages = [];
      }
    });
  }

  fillWithMockData() {
    this.receiptForm.setValue({
      company: 'Axess AG.',
      streetAddress: '25 Sony St',
      cityZipCode: 'Anif, 12345',
      website: 'https://teamaxess.com/de/',
      dateTime: new Date().toISOString().slice(0, 10),
      productName: '1-Day Ticket',
      price: 99.99,
    });
  }

  onSubmit() {
    if (this.receiptForm.valid) {
      console.log('Form submitted');

      const receipt: Receipt = this.receiptForm.value;
      this.store.dispatch(submitReceipt({ receipt }));
      if (this.isSuccess) {
        this.messages = [
          { severity: 'success', detail: 'Successfully Printed!' },
        ];
      }
    } else {
      console.log('Invalid form');
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.receiptForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('pattern') && controlName === 'website') {
      return 'Website must start with http:// or https://';
    }
    if (control?.hasError('min') && controlName === 'price') {
      return 'Price must be a positive number';
    }
    return '';
  }

  close() {
    this.store.dispatch(isDialogOpen());
  }
}
