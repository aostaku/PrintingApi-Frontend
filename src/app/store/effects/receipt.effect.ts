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
  getReceiptOffline,
  getReceiptOfflineFailure,
  getReceiptOfflineSuccess,
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
  private offlineUrl = AppSettings.offlineServerUrl;

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
            catchError((error) => {
              console.error(
                'Error fetching receipts from primary endpoint:',
                error
              );
              // Dispatch the getReceiptOffline action to trigger the fallback
              return this.http
                .get<PageableCollection<Receipt>>(
                  `${this.offlineUrl}/api/invoice`,
                  {
                    params: {
                      pageIndex: action.pageIndex.toString(),
                      pageSize: action.pageSize.toString(),
                    },
                  }
                )
                .pipe(
                  map((receipt: PageableCollection<Receipt>) =>
                    getReceiptOfflineSuccess({ receipt: receipt.data })
                  ),
                  catchError((error) => {
                    console.error(
                      'Error fetching receipts from offline endpoint:',
                      error
                    );
                    return of(getReceiptOfflineFailure({ error }));
                  })
                );
            })
          )
      )
    )
  );

  getAllReceiptsOffline$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getReceiptOffline),
      mergeMap((action) =>
        this.http
          .get<PageableCollection<Receipt>>(`${this.offlineUrl}/api/invoice`, {
            params: {
              pageIndex: action.pageIndex.toString(),
              pageSize: action.pageSize.toString(),
            },
          })
          .pipe(
            map((receipt: PageableCollection<Receipt>) =>
              getReceiptOfflineSuccess({ receipt: receipt.data })
            ),
            catchError((error) => of(getReceiptOfflineFailure({ error })))
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
