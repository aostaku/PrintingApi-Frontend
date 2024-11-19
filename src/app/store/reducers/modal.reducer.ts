import { createReducer, on } from '@ngrx/store';
import { isDialogOpen } from '../actions/modal.actions';

export interface ModalStateInterface {
  dialogOpen: boolean;
}

const initialState: ModalStateInterface = {
  dialogOpen: false,
};

export const modalReducer = createReducer(
  initialState,
  on(isDialogOpen, (state) => ({ ...state, dialogOpen: !state.dialogOpen }))
);
