import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideEffects } from '@ngrx/effects';
import {
  StoreRouterConnectingModule,
  provideRouterStore,
  routerReducer,
} from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { ReceiptEffects } from './store/effects/receipt.effect';
import { modalReducer } from './store/reducers/modal.reducer';
import {
  getReceiptOfflineReducer,
  getReceiptReducer,
  receiptReducer,
} from './store/reducers/receipt.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideRouter(routes),
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(StoreRouterConnectingModule.forRoot()),
    provideStore({
      router: routerReducer,
      modal: modalReducer,
      receipt: receiptReducer,
      getAllReceipts: getReceiptReducer,
      getAllReceiptsOffline: getReceiptOfflineReducer,
    }),
    provideRouterStore(),
    provideEffects([ReceiptEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: true,
      connectInZone: true,
    }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
