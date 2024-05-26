import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { PhotosComponent } from './photos/photos.component';
import { CategoriesComponent } from './categories/categories.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule, HttpRequest } from '@angular/common/http'; 
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from'@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgOptimizedImage } from '@angular/common'
import { MatSelectModule } from '@angular/material/select';
import { ClosedCasesComponent } from './closed-cases/closed-cases.component';
import { LoginComponent } from './login/login.component';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService } from './Services/storage.service';
import { LoginService } from './Services/login.service';
import { MatDialogModule } from '@angular/material/dialog';
import { VerifyPhotoDialogComponent } from './photos/verify-photo-dialog/verify-photo-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';


export function jwtOptionsFactory() {
  return {
    // Configure your JWT options here, if needed
  };
}

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    PhotosComponent,
    CategoriesComponent,
    ClosedCasesComponent,
    LoginComponent,
    VerifyPhotoDialogComponent,
],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatMenuModule,
    MatCardModule,
    MatPaginatorModule,
    MatTableModule,
    HttpClientModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    NgOptimizedImage,
    MatDialogModule,
    MatSelectModule,
    MatTooltipModule,
    JwtModule.forRoot({
      config: {
          tokenGetter: tokenGetter,
          allowedDomains: ['localhost:4200'],
          disallowedRoutes: ["http://example.com/examplebadroute/"],
          authScheme: "Bearer " // Default value
      }
  })
  ],
  providers: [    
    JwtHelperService,
    StorageService,
    LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }

