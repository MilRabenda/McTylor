import { Component, OnInit } from '@angular/core';
import { WelcomePageComponent } from '../welcome-page/welcome-page.component';

@Component({
  selector: 'app-last-page',
  templateUrl: './last-page.component.html',
  styleUrls: ['./last-page.component.scss'],
})
export class LastPageComponent  implements OnInit {

  component = WelcomePageComponent;

  constructor() { }

  ngOnInit() {}

}
