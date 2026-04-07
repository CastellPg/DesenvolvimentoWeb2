import { Component, signal } from '@angular/core';
import { RouterOutlet, Router,NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './shared/navbar/navbar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');

  exibirSideBar: boolean = true;

  constructor(private router: Router){

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {

      const url = this.router.url;
      this.exibirSideBar = !url.includes('login') && !url.includes('registro');
    });
    
  }
}
