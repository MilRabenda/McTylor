import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhotosComponent } from './photos/photos.component';
import { CategoriesComponent } from './categories/categories.component';
import { ClosedCasesComponent } from './closed-cases/closed-cases.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './Services/auth-guard.service';
import { AuthorComponent } from './author/author.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'Photos', component: PhotosComponent, canActivate: [AuthGuard] },
  { path: 'Categories', component: CategoriesComponent, canActivate: [AuthGuard] },
  { path: 'Archiwum', component: ClosedCasesComponent, canActivate: [AuthGuard] },
  { path: 'Author', component: AuthorComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
