import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './Services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  title = 'McTylorWebsite';
  isLoggedIn: boolean = false;

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    this.loginService.getUserLoginStatus().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    })
  }

  openPhotos(){
    this.router.navigateByUrl('/Photos');
  }

  openCategories(){
    this.router.navigateByUrl('/Categories');
  }

  openArchiwum(){
    this.router.navigateByUrl('/Archiwum');
  }

  openAuthor(){
    this.router.navigateByUrl('/Author');
  }

  logout(){
    this.loginService.logout();
    this.router.navigateByUrl('');
  }
}
