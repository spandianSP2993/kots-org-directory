import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

export interface OrganisationListTranslations {
  title: string;
  controlsLabel: string;
  searchLabel: string;
  searchPlaceholder: string;
  statusFilterLabel: string;
  statusFilter: {
    all: string;
    active: string;
    suspended: string;
    inactive: string;
    unknown: string;
  };
  sortLabel: string;
  sort: {
    nameAscending: string;
    nameDescending: string;
    createdNewest: string;
    createdOldest: string;
  };
  loading: string;
  errorTitle: string;
  errorMessage: string;
  retry: string;
  createTitle: string;
  createMemoryNotice: string;
  create: {
    nameLabel: string;
    nameRequired: string;
    nameMinLength: string;
    nameMaxLength: string;
    nameDuplicate: string;
    statusLabel: string;
    statusRequired: string;
    emailLabel: string;
    emailRequired: string;
    emailInvalid: string;
    memberCountLabel: string;
    memberCountInvalid: string;
    submit: string;
    cancel: string;
  };
  createButton: string;
  empty: string;
  noMatches: string;
  tableRegionLabel: string;
  tableCaption: string;
  column: {
    name: string;
    status: string;
    memberCount: string;
    ownerEmail: string;
    createdAt: string;
  };
  status: {
    active: string;
    suspended: string;
    inactive: string;
    unknown: string;
  };
  valueMissing: string;
  emailInvalid: string;
}

export interface TranslationDictionary {
  organisationList: OrganisationListTranslations;
}

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly http = inject(HttpClient);
  private translations: TranslationDictionary | null = null;

  loadTranslations(): Observable<void> {
    return this.http
      .get<TranslationDictionary>('/assets/i18n/en.json')
      .pipe(
        tap((translations) => {
          this.translations = translations;
        }),
        map(() => undefined)
      );
  }

  translate(key: string): string {
    if (!this.translations) {
      return this.missingTranslation(key);
    }

    let value: unknown = this.translations;

    for (const segment of key.split('.')) {
      if (
        typeof value !== 'object' ||
        value === null ||
        !(segment in value)
      ) {
        return this.missingTranslation(key);
      }

      value = (value as Record<string, unknown>)[segment];
    }

    return typeof value === 'string' ? value : this.missingTranslation(key);
  }

  private missingTranslation(key: string): string {
    return `[Missing translation: ${key}]`;
  }
}
