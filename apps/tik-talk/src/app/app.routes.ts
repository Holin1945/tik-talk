import { Routes } from '@angular/router';
import { FormsExperimentComponent } from './experimental/forms-experiment/forms-experiment.component';
import { canActivateAuth, LoginPageComponent } from '@tt/auth';
import { chatsRoutes } from '@tt/chats';
import { ProfilePageComponent, SearchPageComponent, SettingsPageComponent } from '@tt/profile';
import { LayoutComponent } from '@tt/layout';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'profile/me', pathMatch: 'full' },
      { path: 'profile/:id', component: ProfilePageComponent },
      { path: 'settings', component: SettingsPageComponent },
      { path: 'search', component: SearchPageComponent },

      {
        path: 'chats',
        loadChildren: () => chatsRoutes,
      },
    ],
    canActivate: [canActivateAuth],
  },
  { path: 'experiment', component: FormsExperimentComponent },
  { path: 'login', component: LoginPageComponent },
];
