import { Injectable, NgModule, isDevMode } from '@angular/core';
import { TranslocoLoader, TranslocoModule, getBrowserLang, provideTransloco } from '@jsverse/transloco';
import { TranslocoLocaleModule, provideTranslocoLocale } from '@jsverse/transloco-locale';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
    public async getTranslation(lang: string) {
        const translation = await import(`../assets/i18n/${lang}.json`);

        return translation.default;
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
