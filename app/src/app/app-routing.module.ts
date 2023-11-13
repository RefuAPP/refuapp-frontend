import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'reservations',
    loadChildren: () =>
      import('./pages/reservations/reservations.module').then(
        (m) => m.ReservationsPageModule,
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'refuge',
    loadChildren: () =>
      import('./pages/refuge/refuge.module').then((m) => m.RefugePageModule),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./pages/signup/signup.module').then((m) => m.SignupPageModule),
  },
  {
    path: 'not-found-page',
    loadChildren: () =>
      import('./pages/not-found-page/not-found-page.module').then(
        (m) => m.NotFoundPagePageModule,
      ),
  },
  {
    path: 'internal-error-page',
    loadChildren: () =>
      import('./pages/internal-error-page/internal-error-page.module').then(
        (m) => m.InternalErrorPagePageModule,
      ),
  },
  {
    path: 'programming-error',
    loadChildren: () =>
      import('./pages/programming-error/programming-error.module').then(
        (m) => m.ProgrammingErrorPageModule,
      ),
  },
  {
    path: 'logout',
    loadChildren: () =>
      import('./pages/logout/logout.module').then((m) => m.LogoutPageModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./pages/profile/profile.module').then((m) => m.ProfilePageModule),
  },
  {
    path: 'forbidden',
    loadChildren: () =>
      import('./pages/forbidden/forbidden/forbidden.module').then(
        (m) => m.ForbiddenPageModule,
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
