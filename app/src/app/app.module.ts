import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './state/auth/auth.effects';
import { StoreModule } from '@ngrx/store';
import { authReducer } from './state/auth/auth.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { LanguageEffects } from './state/language/language.effects';
import { languageReducer } from './state/language/language.reducer';
import { InitEffects } from './state/init/init.effects';
import { initReducer } from './state/init/init.reducer';
import { environment } from '../environments/environment';
import { modalReducer } from './state/components/modal/modal.reducer';
import { mapReducer } from './state/map/map.reducer';
import { MapEffects } from './state/map/map.effects';
import { ReservationsEffects } from './state/reservations/reservations.effects';
import { reservationsReducer } from './state/reservations/reservations.reducer';
import { errorReducer } from './state/errors/error.reducer';
import { ErrorEffects } from './state/errors/error.effects';
import { ReservationsPageModule } from './pages/reservations/reservations.module';
import { refugesReducer } from './state/refuges/refuges.reducer';
import { RefugesEffects } from './state/refuges/refuges.effects';
import { ModalEffects } from './state/components/modal/modal.effects';
import { messageReducer } from './state/messages/message.reducer';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    AppRoutingModule,
    StoreModule.forRoot(
      {
        auth: authReducer,
        language: languageReducer,
        initStatus: initReducer,
        map: mapReducer,
        modal: modalReducer,
        reservations: reservationsReducer,
        error: errorReducer,
        refuges: refugesReducer,
        messages: messageReducer,
      },
      {
        // This is because inmutability objects on actions (and google maps libraries and capacitor change the object from the action)
        runtimeChecks: {
          strictStateImmutability: environment.production,
          strictActionImmutability: environment.production,
        },
      },
    ),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      connectOutsideZone: true, // If set to true, the connection is established outside the Angular zone for better performance
    }),
    EffectsModule.forRoot([
      InitEffects,
      AuthEffects,
      LanguageEffects,
      MapEffects,
      ReservationsEffects,
      ErrorEffects,
      RefugesEffects,
      ModalEffects,
    ]),
    ReservationsPageModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
