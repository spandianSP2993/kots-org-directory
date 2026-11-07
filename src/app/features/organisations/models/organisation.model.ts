export interface RawOrganisation {
  id: number;
  name?: string | null;
  status?: string | null;
  memberCount?: number | string | null;
  owner?: {
    email?: string | null;
  } | null;
  createdAt?: string | number | null;
}

export type OrganisationStatus =
  | 'active'
  | 'suspended'
  | 'inactive'
  | 'unknown';

  export type EmailStatus = 'valid' | 'missing' | 'invalid';

export interface Organisation {
  id: number;
  name: string | null;
  status: OrganisationStatus;
  memberCount: number | null;
  ownerEmail: string | null;
  emailStatus: EmailStatus;
  createdAt: Date | null;
}