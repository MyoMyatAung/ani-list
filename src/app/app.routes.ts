import { Routes } from '@angular/router';
import { Dashboard } from './component/dashboard/dashboard';
import { AniList } from './component/ani-list/ani-list';
import { Settings } from './component/settings/settings';
export const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'ani-list', component: AniList },
  { path: 'settings', component: Settings },
];
