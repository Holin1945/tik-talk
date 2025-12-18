import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProfileCardComponent } from '../../ui';
import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component';
import { selectFilteredProfiles } from '../../data/store';

@Component({
  selector: 'app-search-page',
  imports: [ProfileCardComponent, ProfileFiltersComponent],
  standalone: true,
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent {
  store = inject(Store)

  profiles = this.store.selectSignal(selectFilteredProfiles);
}