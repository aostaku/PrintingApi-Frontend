import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  ConnectionService,
  ConnectionServiceOptions,
  ConnectionState,
} from 'ng-connection-service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { catchError, of, Subscription, tap, timeout } from 'rxjs';
import { AppSettings } from './app.settings';
import { ReceiptsComponent } from './components/receipts/receipts.component';
import { isDialogOpen } from './store/actions/modal.actions';
import {
  getReceipt,
  getReceiptOffline,
  printReceiptById,
} from './store/actions/receipt.action';
import {
  selectAllReceiptError,
  selectAllReceipts,
  selectReceiptLoading,
} from './store/selectors/receipt.selector';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ButtonModule,
    CardModule,
    ProgressSpinnerModule,
    ReceiptsComponent,
    TableModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  apiUrl = AppSettings.localServerUrl;
  http = inject(HttpClient);
  store = inject(Store);
  status!: string;
  currentState!: ConnectionState;
  subscription = new Subscription();
  connectionService = inject(ConnectionService);

  allReceipts = this.store.selectSignal(selectAllReceipts);
  loading = this.store.selectSignal(selectReceiptLoading);
  errorAllReceipts = this.store.selectSignal(selectAllReceiptError);

  pageIndex = 1;
  pageSize = 10;

  ngOnInit() {
    const options: ConnectionServiceOptions = {
      enableHeartbeat: true,
      heartbeatUrl: `${this.apiUrl}/api/invoice/heartbeat`,
      heartbeatInterval: 20000,
    };

    this.subscription.add(
      this.connectionService
        .monitor(options)
        .pipe(
          timeout(15000),
          tap((newState: ConnectionState) => {
            this.currentState = newState;
            console.log('Current state:', this.currentState);

            if (
              this.currentState.hasNetworkConnection &&
              this.currentState.hasInternetAccess
            ) {
              this.status = 'ONLINE';
            } else {
              this.status = 'OFFLINE';
            }
            console.log('Status set to:', this.status);
          }),
          catchError((error) => {
            console.error('Heartbeat error:', error);
            this.status = 'OFFLINE';
            return of(null); // Return a null observable to continue the stream
          })
        )
        .subscribe(() => {
          console.log('Subscription triggered with status:', this.status);
          if (this.status === 'ONLINE') {
            console.log('Online data was triggered');
            this.store.dispatch(
              getReceipt({ pageIndex: this.pageIndex, pageSize: this.pageSize })
            );
          } else if (this.status === 'OFFLINE') {
            console.log('Offline data was triggered');
            this.store.dispatch(
              getReceiptOffline({ pageIndex: 1, pageSize: 10 })
            );
          }
          console.log('Status:', this.status);
          console.log('If status:', this.status === 'ONLINE');
        })
    );
  }

  printReceipt(receiptId: string) {
    this.store.dispatch(printReceiptById({ id: receiptId }));
  }
  newReceipt() {
    this.store.dispatch(isDialogOpen());
  }
  title = 'web-pwa';
}
