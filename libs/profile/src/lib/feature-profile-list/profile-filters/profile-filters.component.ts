import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';
import { profileActions, profileFeature } from '../../data/store';

@Component({
  selector: 'app-profile-filters',
  imports: [ReactiveFormsModule],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFiltersComponent{
  fb = inject(FormBuilder);
  store = inject(Store);

  searchForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    stack: [''],
  });

   constructor() {
    this.store
      .select(profileFeature.selectProfileFilters)
      .pipe(takeUntilDestroyed())
      .subscribe((filters) => {
        if (filters) {
          this.searchForm.patchValue(filters, { emitEvent: false });
        }
      });
    this.searchForm.valueChanges
      .pipe(
        startWith(this.searchForm.value),
        debounceTime(500),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntilDestroyed()
      )
      .subscribe((formValue) => {
        this.store.dispatch(profileActions.filterEvents({ filters: formValue }));
      });
  }
}
