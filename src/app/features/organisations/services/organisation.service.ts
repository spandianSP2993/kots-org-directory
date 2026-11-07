import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Organisation, RawOrganisation } from '../models/organisation.model';
import { OrganisationNormalizerService } from './organisation-normalizer.service';

@Injectable({ providedIn: 'root' })
export class OrganisationService {
  private readonly http = inject(HttpClient);
  private readonly normalizer = inject(OrganisationNormalizerService);

  getOrganisations(): Observable<Organisation[]> {
    return this.http.get<RawOrganisation[]>('/organisations.json').pipe(
      map((rawOrganisations: RawOrganisation[]) =>
        this.normalizer.normalizeAll(rawOrganisations)
      )
    );
  }
}