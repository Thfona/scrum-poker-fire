import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressRouterModule } from 'ngx-progressbar/router';

import { AppRoutingModule } from './app-routing.module';
import { PagesModule } from './pages/pages.module';
import { SharedModule } from './shared/shared.module';

import { TokenInterceptor } from './shared/interceptors/token.interceptor';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';

import { AppComponent } from './app.component';

const MODULES = [
  AppRoutingModule,
  BrowserModule,
  HttpClientModule,
  NgProgressModule,
  NgProgressRouterModule,
  PagesModule,
  SharedModule
];

@NgModule({
  declarations: [AppComponent],
  imports: [...MODULES],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
