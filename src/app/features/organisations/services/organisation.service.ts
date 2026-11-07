import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map, mergeMap, throwError, timer } from 'rxjs';
import { Organisation, RawOrganisation } from '../models/organisation.model';
import { OrganisationNormalizerService } from './organisation-normalizer.service';

@Injectable({ providedIn: 'root' })
export class OrganisationService {
  private readonly http = inject(HttpClient);
  private readonly normalizer = inject(OrganisationNormalizerService);

  getOrganisations(): Observable<Organisation[]> {
    const randomRelay = Math.floor(Math.random() * 501) + 400;

    return timer(randomRelay).pipe(
        mergeMap(() => {
            const shouldFail = Math.random() < 0.15; // 10% chance of failure

            if (shouldFail) {
          return throwError(() => new Error('Simulated API failure'));
        }

            return this.http.get<RawOrganisation[]>('/organisations.json').pipe(
      map((rawOrganisations: RawOrganisation[]) =>
        this.normalizer.normalizeAll(rawOrganisations)
      )
    );
        })
    )
    
  }
}