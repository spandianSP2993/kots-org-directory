import { APP_INITIALIZER, ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { routes } from './app.routes';
import { TranslationService } from './core/i18n/translation.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const translationService = inject(TranslationService);
        return () => firstValueFrom(translationService.loadTranslations());
      },
      multi: true
    }
  ]
};
