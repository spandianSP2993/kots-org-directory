import { TestBed } from '@angular/core/testing';
import { OrganisationNormalizerService } from './organisation-normalizer.service';

describe('OrganisationNormalizerService', () => {
  let service: OrganisationNormalizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganisationNormalizerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});