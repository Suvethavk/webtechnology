import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  
  loginAction(): void {
    console.log('Login attempt:', this.email);
    // Add your login logic here
  }
}
