import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type MenuItem = 'Pizza' | 'Burger' | 'Pasta' | 'Noodles' | 'Ice Cream' | 'Cake';

@Component({
  selector: 'app-bill-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bill-calculator.component.html',
  styleUrls: ['./bill-calculator.component.css']
})
export class BillCalculatorComponent {
  customerName = '';
  tableNumber = '';
  selectedItem: MenuItem | '' = '';
  quantity = 1;
  prices: Record<MenuItem, number> = {
    Pizza: 250,
    Burger: 180,
    Pasta: 220,
    Noodles: 190,
    'Ice Cream': 120,
    Cake: 150
  };
  orders: Array<{item: MenuItem, price: number, quantity: number, total: number}> = [];
  subtotal = 0;

  get priceKeys(): MenuItem[] {
    return Object.keys(this.prices) as MenuItem[];
  }

  addItem() {
    if (this.selectedItem && this.quantity > 0) {
      const price = this.prices[this.selectedItem];
      const total = price * this.quantity;
      this.orders.push({ item: this.selectedItem, price, quantity: this.quantity, total });
      this.calculateTotal();
      this.selectedItem = '';
      this.quantity = 1;
    }
  }

  removeItem(index: number) {
    this.orders.splice(index, 1);
    this.calculateTotal();
  }

  calculateTotal() {
    this.subtotal = this.orders.reduce((sum, item) => sum + item.total, 0);
  }
}
