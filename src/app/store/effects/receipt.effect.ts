import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { AppSettings } from '../../app.settings';
import { PageableCollection } from '../../models/PageableCollection';
import { Receipt } from '../../models/receiptDTO';
import {
  getReceipt,
  getReceiptFailure,
  getReceiptSuccess,
  printReceipt,
  printReceiptById,
  printReceiptByIdSuccess,
  printReceiptFailure,
  printReceiptSuccess,
  submitReceipt,
  submitReceiptFailure,
  submitReceiptSuccess,
} from '../actions/receipt.action';

@Injectable()
export class ReceiptEffects {
  constructor(private actions$: Actions, private http: HttpClient) {}
  private apiUrl = AppSettings.localServerUrl;

  getAllReceipts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getReceipt),
      mergeMap((action) =>
        this.http
          .get<PageableCollection<Receipt>>(`${this.apiUrl}/api/invoice`, {
            params: {
              pageIndex: action.pageIndex.toString(),
              pageSize: action.pageSize.toString(),
            },
          })
          .pipe(
            map((receipt: PageableCollection<Receipt>) =>
              getReceiptSuccess({ receipt: receipt.data })
            ),
            catchError((error) => of(getReceiptFailure({ error })))
          )
      )
    )
  );

  printReceipt$ = createEffect(() =>
    this.actions$.pipe(
      ofType(printReceipt),
      mergeMap(({ receipt }) =>
        this.http
          .post<Receipt>(`${this.apiUrl}/api/invoice/print`, receipt)
          .pipe(
            map((newReceipt) => printReceiptSuccess({ receipt: newReceipt })),
            catchError((error) => of(printReceiptFailure({ error })))
          )
      )
    )
  );

  printReceiptById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(printReceiptById),
      mergeMap(({ id }) =>
        this.http.post(`${this.apiUrl}/api/invoice/print/${id}`, null).pipe(
          map(() => printReceiptByIdSuccess()),
          catchError((error) => of(printReceiptFailure({ error })))
        )
      )
    )
  );

  submitReceipt$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitReceipt),
      mergeMap(({ receipt }) =>
        this.http.post<Receipt>(`${this.apiUrl}/api/invoice`, receipt).pipe(
          map((newReceipt) => submitReceiptSuccess({ receipt: newReceipt })),
          catchError((error) => of(submitReceiptFailure({ error })))
        )
      )
    )
  );
}
