import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, effect, inject } from '@angular/core';
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
import { Subscription, tap } from 'rxjs';
import { ReceiptsComponent } from './components/receipts/receipts.component';
import { isDialogOpen } from './store/actions/modal.actions';
import { getReceipt, printReceiptById } from './store/actions/receipt.action';
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

  constructor() {
    this.store.dispatch(
      getReceipt({ pageIndex: this.pageIndex, pageSize: this.pageSize })
    );
    if (this.status === 'ONLINE') {
      // this.getData();
    } else if (this.status === 'OFFLINE') {
      this.getOfflineData();
    }
    effect(() => {
      console.log('Status:', this.status);
      console.log('If status:', this.status === 'ONLINE');
    });
  }

  ngOnInit() {
    const options: ConnectionServiceOptions = {
      enableHeartbeat: false,
      heartbeatUrl: 'http://localhost:5068/hartbeat',
      heartbeatInterval: 200000,
    };
    this.subscription.add(
      this.connectionService
        .monitor(options)
        .pipe(
          tap((newState: ConnectionState) => {
            this.currentState = newState;

            if (this.currentState.hasNetworkConnection) {
              this.status = 'ONLINE';
            } else {
              this.status = 'OFFLINE';
            }
          })
        )
        .subscribe()
    );
  }

  getOfflineData = () => {};

  printReceipt(receiptId: string) {
    this.store.dispatch(printReceiptById({ id: receiptId }));
  }
  newReceipt() {
    this.store.dispatch(isDialogOpen());
  }
  title = 'web-pwa';
}