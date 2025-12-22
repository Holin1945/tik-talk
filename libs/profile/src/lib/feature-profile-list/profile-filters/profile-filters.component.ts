import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { profileActions } from '../../data/store';
import { debounceTime, startWith, Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-filters',
  imports: [ReactiveFormsModule],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss',
})
export class ProfileFiltersComponent implements OnInit, OnDestroy {
  fb = inject(FormBuilder);
  store = inject(Store);

  searchFormSub!: Subscription;

  searchForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    stack: [''],
  });

  constructor() {
    this.searchForm.valueChanges.pipe(startWith({}), debounceTime(300)).subscribe((formValue) => {
      localStorage.setItem('profileFilters', JSON.stringify(formValue));
      this.store.dispatch(profileActions.filterEvents({ filters: formValue }));
    });
    takeUntilDestroyed();
  }

  ngOnInit() {
    const savedFilters = localStorage.getItem('profileFilters');
    if (savedFilters) {
      this.searchForm.setValue(JSON.parse(savedFilters));
    }
  }

  ngOnDestroy() {
    this.searchFormSub.unsubscribe();
  }
}
