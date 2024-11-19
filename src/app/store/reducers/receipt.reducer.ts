import { createReducer, on } from '@ngrx/store';
import { Receipt } from '../../models/receiptDTO';
import {
  getReceipt,
  getReceiptSuccess,
  submitReceipt,
  submitReceiptFailure,
  submitReceiptSuccess,
} from '../actions/receipt.action';

export interface ReceiptStateInterface {
  receipt: Receipt | null;
  success: boolean;
  error: any;
}

export interface ReceiptState {
  receipt: Receipt[] | null;
  loading: boolean;
  error: any;
}

export const initialState: ReceiptStateInterface = {
  receipt: null,
  success: false,
  error: null,
};

export const receiptInitialState: ReceiptState = {
  receipt: null,
  loading: false,
  error: null,
};

export const receiptReducer = createReducer(
  initialState,
  on(submitReceipt, (state) => ({ ...state, receipt: null, error: null })),
  on(submitReceiptSuccess, (state, { receipt }) => ({
    ...state,
    receipt,
    success: true,
  })),
  on(submitReceiptFailure, (state, { error }) => ({ ...state, error }))
);

export const getReceiptReducer = createReducer(
  receiptInitialState,
  on(getReceipt, (state) => ({ ...state, loading: true, error: null })),
  on(getReceiptSuccess, (state, { receipt }) => ({
    ...state,
    receipt,
    loading: false,
  })),
  on(submitReceiptFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
