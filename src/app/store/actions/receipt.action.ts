import { createAction, props } from '@ngrx/store';
import { Receipt } from '../../models/receiptDTO';

export const getReceipt = createAction(
  '[Receipt] Get Receipt',
  props<{ pageIndex: number; pageSize: number }>()
);
export const getReceiptSuccess = createAction(
  '[Receipt] Get Receipt Success',
  props<{ receipt: Receipt[] }>()
);
export const getReceiptFailure = createAction(
  '[Receipt] Get Receipt Failure',
  props<{ error: any }>()
);

export const printReceipt = createAction(
  '[Receipt] Print Receipt',
  props<{ receipt: Receipt }>()
);
export const printReceiptSuccess = createAction(
  '[Receipt] Print Receipt Success',
  props<{ receipt: Receipt }>()
);
export const printReceiptFailure = createAction(
  '[Receipt] Print Receipt Failure',
  props<{ error: any }>()
);

export const printReceiptById = createAction(
  '[Receipt] Print Receipt By Id',
  props<{ id: string }>()
);
export const printReceiptByIdSuccess = createAction(
  '[Receipt] Print Receipt By Id Success'
);
export const printReceiptByIdFailure = createAction(
  '[Receipt] Print Receipt By Id Failure',
  props<{ error: any }>()
);

export const submitReceipt = createAction(
  '[Receipt] Submit Receipt',
  props<{ receipt: Receipt }>()
);

export const submitReceiptSuccess = createAction(
  '[Receipt] Submit Receipt Success',
  props<{ receipt: Receipt }>()
);

export const submitReceiptFailure = createAction(
  '[Receipt] Submit Receipt Failure',
  props<{ error: any }>()
);
