import { isPlatformBrowser } from '@angular/common';
import { ClassProvider, FactoryProvider, InjectionToken, PLATFORM_ID } from '@angular/core';

export const WINDOW = new InjectionToken('WindowToken');

export abstract class WindowRef {
    get nativeWindow(): Window | object {
        throw new Error('Not implemented.');
    }
}

export class BrowserWindowRef extends WindowRef {
    constructor() {
        super();
    }

    override get nativeWindow(): Window | object {
        return window;
    }
}

export function windowFactory(browserWindowRef: BrowserWindowRef, platformId: object): Window | object {
    if (isPlatformBrowser(platformId)) {
        return browserWindowRef.nativeWindow;
    }

    return new Object();
}

const BROWSER_WINDOW_PROVIDER: ClassProvider = {
    provide: WindowRef,
    useClass: BrowserWindowRef,
};

const WINDOW_PROVIDER: FactoryProvider = {
    provide: WINDOW,
    useFactory: windowFactory,
    deps: [WindowRef, PLATFORM_ID],
};

export const WINDOW_PROVIDERS = [BROWSER_WINDOW_PROVIDER, WINDOW_PROVIDER];
