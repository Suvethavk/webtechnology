import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  currentYear: number = new Date().getFullYear();
  foodItems = [
    { id: 1, name: 'Pizza', price: 250 },
    { id: 2, name: 'Burger', price: 120 },
    { id: 3, name: 'Pasta', price: 180 }
  ];
}
