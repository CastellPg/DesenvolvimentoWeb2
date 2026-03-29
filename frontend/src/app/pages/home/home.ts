import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {}
