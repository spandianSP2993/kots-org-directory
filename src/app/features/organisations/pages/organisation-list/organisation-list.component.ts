import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';
import { Organisation, OrganisationStatus } from '../../models/organisation.model';
import { OrganisationService } from '../../services/organisation.service';

type StatusFilter = OrganisationStatus | 'all';
type OrganisationSort = 'name-asc' | 'name-desc' | 'created-newest' | 'created-oldest';

@Component({
  selector: 'app-organisation-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './organisation-list.component.html',
  styleUrl: './organisation-list.component.scss'
})
export class OrganisationListComponent implements OnInit {
  private readonly organisationService = inject(OrganisationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly searchChanges = new Subject<string>();

  readonly organisations = signal<Organisation[]>([]);
  readonly isLoading = signal(true);
  readonly hasError = signal(false);
  readonly searchInput = signal('');
  readonly searchTerm = signal('');
  readonly statusFilter = signal<StatusFilter>('all');
  readonly sortOrder = signal<OrganisationSort>('name-asc');
  readonly displayedOrganisations = computed(() => {
    const searchTerm = this.searchTerm().trim().toLocaleLowerCase();
    const statusFilter = this.statusFilter();
    const sortOrder = this.sortOrder();

    const filteredOrganisations = this.organisations().filter((organisation) => {
      const matchesName = (organisation.name ?? '')
        .toLocaleLowerCase()
        .includes(searchTerm);
      const matchesStatus =
        statusFilter === 'all' || organisation.status === statusFilter;

      return matchesName && matchesStatus;
    });

    return filteredOrganisations.sort((left, right) => {
      if (sortOrder === 'name-asc' || sortOrder === 'name-desc') {
        const comparison = (left.name ?? '').localeCompare(right.name ?? '', undefined, {
          sensitivity: 'base'
        });
        return sortOrder === 'name-asc' ? comparison : -comparison;
      }

      const leftDate = left.createdAt?.getTime() ?? null;
      const rightDate = right.createdAt?.getTime() ?? null;

      if (leftDate === null || rightDate === null) {
        if (leftDate === rightDate) {
          return 0;
        }
        return leftDate === null ? 1 : -1;
      }

      return sortOrder === 'created-newest'
        ? rightDate - leftDate
        : leftDate - rightDate;
    });
  });

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => this.restoreControls(params));

    this.searchChanges
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe((search) => {
        this.searchTerm.set(search);
        this.updateQueryParams();
      });

    this.loadOrganisations();
  }

  onSearchInput(event: Event): void {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    this.searchInput.set(input.value);
    this.searchChanges.next(input.value);
  }

  onStatusChange(event: Event): void {
    const select = event.target;
    if (!(select instanceof HTMLSelectElement) || !this.isStatusFilter(select.value)) {
      return;
    }

    this.statusFilter.set(select.value);
    this.updateQueryParams();
  }

  onSortChange(event: Event): void {
    const select = event.target;
    if (!(select instanceof HTMLSelectElement) || !this.isSortOrder(select.value)) {
      return;
    }

    this.sortOrder.set(select.value);
    this.updateQueryParams();
  }

  loadOrganisations(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.organisationService.getOrganisations().subscribe({
      next: (organisations: Organisation[]) => {
        this.organisations.set(organisations);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  private restoreControls(params: ParamMap): void {
    const search = params.get('search') ?? '';
    const status = params.get('status');
    const sort = params.get('sort');
    const nextStatus: StatusFilter = this.isStatusFilter(status) ? status : 'all';
    const nextSort: OrganisationSort = this.isSortOrder(sort) ? sort : 'name-asc';

    if (
      this.searchInput() === search &&
      this.statusFilter() === nextStatus &&
      this.sortOrder() === nextSort
    ) {
      return;
    }

    this.searchInput.set(search);
    this.searchTerm.set(search);
    this.statusFilter.set(nextStatus);
    this.sortOrder.set(nextSort);
    // this.searchChanges.next(search);
  }

  private updateQueryParams(): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: this.searchInput().trim() || null,
        status: this.statusFilter() === 'all' ? null : this.statusFilter(),
        sort: this.sortOrder() === 'name-asc' ? null : this.sortOrder()
      },
      queryParamsHandling: 'merge'
    });
  }

  private isStatusFilter(value: string | null): value is StatusFilter {
    return value === 'all' ||
      value === 'active' ||
      value === 'suspended' ||
      value === 'inactive' ||
      value === 'unknown';
  }

  private isSortOrder(value: string | null): value is OrganisationSort {
    return value === 'name-asc' ||
      value === 'name-desc' ||
      value === 'created-newest' ||
      value === 'created-oldest';
  }
}