import { AppState } from '../../models/AppInterface';

export const selectIsModalOpen = (state: AppState) => state.modal.dialogOpen;
