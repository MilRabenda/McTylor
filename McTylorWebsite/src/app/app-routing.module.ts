import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhotosComponent } from './photos/photos.component';
import { CategoriesComponent } from './categories/categories.component';

const routes: Routes = [
  {path: '', component: PhotosComponent},
  {path: 'Photos', component: PhotosComponent},
  {path: 'Categories', component: CategoriesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
