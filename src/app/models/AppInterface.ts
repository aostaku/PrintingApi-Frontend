import { ModalStateInterface } from '../store/reducers/modal.reducer';
import {
  ReceiptState,
  ReceiptStateInterface,
} from '../store/reducers/receipt.reducer';

export interface AppState {
  modal: ModalStateInterface;
  receipt: ReceiptStateInterface;
  getAllReceipts: ReceiptState;
}
