import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ProfileService } from '@tt/data-access';
import { map, switchMap, withLatestFrom } from 'rxjs';
import { selectProfileFilters, selectProfilePageable } from '../store/selectors';
import { profileActions } from './actions';

@Injectable({
  providedIn: 'root',
})
export class ProfileEffects {
  profileService = inject(ProfileService);
  actions$ = inject(Actions);
  store = inject(Store);

  filterProfiles = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.filterEvents, profileActions.setPage),
      withLatestFrom(
        this.store.select(selectProfileFilters),
        this.store.select(selectProfilePageable)
      ),
      switchMap(([_, filters, pageable]) => {
        return this.profileService.filterProfiles({
          ...pageable,
          ...filters,
        });
      }),
      map(res => profileActions.profilesLoaded({profiles: res.items}))
    );
  });
}
