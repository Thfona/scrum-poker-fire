import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressRouterModule } from 'ngx-progressbar/router';
import { AngularFireModule } from '@angular/fire/compat';
import { AppRoutingModule } from './app-routing.module';
import { PagesModule } from './pages/pages.module';
import { SharedModule } from './shared/shared.module';
import { WINDOW_PROVIDERS } from './shared/services/window.service';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';

const MODULES = [
  AngularFireModule.initializeApp(environment.firebaseConfig),
  AppRoutingModule,
  BrowserModule,
  HttpClientModule,
  NgProgressModule,
  NgProgressRouterModule,
  PagesModule,
  SharedModule
];

const SERVICES = [WINDOW_PROVIDERS];

@NgModule({
  declarations: [AppComponent],
  imports: [...MODULES],
  bootstrap: [AppComponent],
  providers: [...SERVICES]
})
export class AppModule {}
