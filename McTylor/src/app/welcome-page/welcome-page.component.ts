import { Component, OnInit } from '@angular/core';
import { PicturePageComponent } from '../picture-page/picture-page.component';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent  implements OnInit {
  component = PicturePageComponent;

  constructor() {}

  ngOnInit() {}

}
