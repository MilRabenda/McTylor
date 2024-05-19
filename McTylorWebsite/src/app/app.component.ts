import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'McTylorWebsite';
  
  constructor( private router: Router) { }

  openPhotos(){
    this.router.navigateByUrl('/Photos');
  }

  openCategories(){
    this.router.navigateByUrl('/Categories');
  }
}
