import { Injectable } from '@angular/core';
import {
  Organisation,
  RawOrganisation,
  OrganisationStatus,
  EmailStatus
} from '../models/organisation.model';

@Injectable({
  providedIn: 'root'
})
export class OrganisationNormalizerService {

    private normalizeName(name?: string | null): string | null {
  const trimmedName = name?.trim();

  return trimmedName || null;
}

private normalizeStatus(status?: string | null): OrganisationStatus {
  const normalizedStatus = status?.trim().toLowerCase();

  switch (normalizedStatus) {
    case 'active':
      return 'active';

    case 'suspended':
      return 'suspended';

    case 'inactive':
      return 'inactive';

    default:
      return 'unknown';
  }
}

private normalizeMemberCount(
  memberCount?: number | string | null
): number | null {
  if (memberCount === null || memberCount === undefined) {
    return null;
  }

  if (typeof memberCount === 'string' && !memberCount.trim()) {
    return null;
  }

  const parsedCount = Number(memberCount);

  if (!Number.isInteger(parsedCount) || parsedCount < 0) {
    return null;
  }

  return parsedCount;
}

private normalizeEmail(
  email: string | null | undefined
): { email: string | null; status: EmailStatus } {

  const trimmedEmail = email?.trim();

  if (!trimmedEmail) {
    return { email: null, status: 'missing' };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(trimmedEmail)) {
    return { email: null, status: 'invalid' };
  }

  return { email: trimmedEmail, status: 'valid' };
}

private normalizeDate(
  createdAt?: string | number | null
): Date | null {
  if (createdAt === null || createdAt === undefined) {
    return null;
  }

  const parsedDate = new Date(createdAt);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
}

normalize(raw: RawOrganisation): Organisation {
  const normalizedEmail = this.normalizeEmail(
    raw.owner?.email
  );

  return {
    id: raw.id,
    name: this.normalizeName(raw.name),
    status: this.normalizeStatus(raw.status),
    memberCount: this.normalizeMemberCount(raw.memberCount),
    ownerEmail: normalizedEmail.email,
    emailStatus: normalizedEmail.status,
    createdAt: this.normalizeDate(raw.createdAt)
  };
}

normalizeAll(rawOrganisations: RawOrganisation[]): Organisation[] {
  const seenIds = new Set<number>();
  const normalizedOrganisations: Organisation[] = [];

  for (const raw of rawOrganisations) {
    if (seenIds.has(raw.id)) {
      continue;
    }

    seenIds.add(raw.id);
    normalizedOrganisations.push(this.normalize(raw));
  }

  return normalizedOrganisations;
}

}