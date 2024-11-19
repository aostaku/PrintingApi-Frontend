import { AppState } from '../../models/AppInterface';

export const selectReceipt = (state: AppState) => state.receipt.receipt;
export const selectReceiptSuccess = (state: AppState) => state.receipt.success;
export const selectReceiptError = (state: AppState) => state.receipt.error;

export const selectAllReceipts = (state: AppState) =>
  state.getAllReceipts.receipt;
export const selectReceiptLoading = (state: AppState) =>
  state.getAllReceipts.loading;
export const selectAllReceiptError = (state: AppState) =>
  state.getAllReceipts.error;
