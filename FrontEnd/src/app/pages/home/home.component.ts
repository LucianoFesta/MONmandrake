import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ItemsMenu } from 'src/app/interfaces/itemsMenu';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(public router: Router){}

  public itemsMenu:ItemsMenu[] = [
    {
      name: 'Home',
      url: '/home'
    },
    {
      name: 'Cambios',
      url : '/home/cambios'
    },
    {
      name: 'Monitoreo',
      url: '/home/monitoreo'
    },
    {
      name: 'APPs',
      url: '/home/apps'
    }
  ]

}
