import { NgModule } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressRouterModule } from 'ngx-progressbar/router';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { windowProviders } from './shared/services/window.service';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';

const modules = [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    NgProgressModule,
    NgProgressRouterModule,
    SharedModule,
];

const providers = [
    provideHttpClient(),
    windowProviders,
];

@NgModule({
    declarations: [AppComponent],
    imports: [...modules],
    providers: [...providers],
    bootstrap: [AppComponent],
})
export class AppModule {}
