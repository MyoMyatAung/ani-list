import { Routes } from '@angular/router';
import { Dashboard } from './component/dashboard/dashboard';
import { SignIn } from './component/sign-in/sign-in';
import { SignUp } from './component/sign-up/sign-up';
import { authGuard } from './guards/auth.guard';
import { Posts } from './component/posts/posts';
import { Users } from './component/users/users';
import { UserDetail } from './component/user-detail/user-detail';

export const routes: Routes = [
  { path: 'sign-in', component: SignIn },
  { path: 'sign-up', component: SignUp },
  { path: '', component: Dashboard, canActivate: [authGuard] },
  { path: 'post', component: Posts, canActivate: [authGuard] },
  { path: 'users', component: Users, canActivate: [authGuard] },
  { path: 'users/:id', component: UserDetail, canActivate: [authGuard] },
  { path: '**', redirectTo: '/sign-in' }
];
