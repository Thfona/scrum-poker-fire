import { NgModule } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgProgressbar } from 'ngx-progressbar';
import { NgProgressRouter } from 'ngx-progressbar/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { windowProviders } from './shared/services/window.service';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';

const modules = [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    NgProgressbar,
    NgProgressRouter,
    SharedModule,
];

const providers = [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
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
