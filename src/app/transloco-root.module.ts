import { Injectable, NgModule, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Translation, TranslocoLoader, TranslocoModule, getBrowserLang, provideTransloco } from '@jsverse/transloco';
import { TranslocoLocaleModule, provideTranslocoLocale } from '@jsverse/transloco-locale';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
    constructor(private readonly httpClient: HttpClient) {}

    public getTranslation(lang: string) {
        return this.httpClient.get<Translation>(`./assets/i18n/${lang}.json?t=${new Date().getTime()}`);
    }
}

@NgModule({
    exports: [TranslocoModule, TranslocoLocaleModule],
    providers: [
        provideTransloco({
            config: {
                availableLangs: ['en', 'pt'],
                defaultLang: getBrowserLang() || 'en',
                fallbackLang: 'en',
                reRenderOnLangChange: true,
                prodMode: !isDevMode(),
            },
            loader: TranslocoHttpLoader,
        }),
        provideTranslocoLocale({
            langToLocaleMapping: {
                en: 'en-US',
                pt: 'pt-BR',
            },
        }),
    ],
})
export class TranslocoRootModule {}
