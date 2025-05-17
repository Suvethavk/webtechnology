import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { BudgetService } from '../services/budget.service';
import { ExpenseService } from '../services/expense.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  activeTab = 'budget-calculator';
  budgetForm: FormGroup;
  expenseForm: FormGroup;
  budgetResult: any = null;
  expenses: any[] = [];
  summary = {
    total: 0,
    budget: 0,
    remaining: 0,
    daily: 0
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private budgetService: BudgetService,
    private expenseService: ExpenseService
  ) {
    this.budgetForm = this.fb.group({
      destination: [''],
      duration: [7],
      travelers: [2],
      accommodation: ['budget'],
      food: ['medium'],
      activities: ['medium'],
      transport: ['mix'],
      currency: ['USD']
    });

    this.expenseForm = this.fb.group({
      description: [''],
      amount: [0],
      category: ['accommodations'],
      date: [new Date().toISOString().substring(0, 10)]
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const user = this.authService.currentUserValue;
    if (user) {
      if (user.budgets && user.budgets.length > 0) {
        const lastBudget = user.budgets[user.budgets.length - 1];
        this.budgetForm.patchValue(lastBudget);
      }
      
      if (user.expenses) {
        this.expenses = [...user.expenses].reverse();
        this.updateExpenseSummary();
      }
    }
  }

  switchTab(tab: string) {
    this.activeTab = tab;
  }

  calculateBudget() {
    const formValue = this.budgetForm.value;
    this.budgetResult = this.budgetService.calculateTravelCosts(
      formValue.duration,
      formValue.travelers,
      formValue.accommodation,
      formValue.food,
      formValue.activities,
      formValue.transport,
      formValue.currency
    );
    
    this.summary.budget = this.budgetResult.totalMax;
    this.updateExpenseSummary();
  }

  addExpense() {
    if (this.expenseForm.valid) {
      const expense = {
        ...this.expenseForm.value,
        id: Date.now().toString()
      };
      
      this.expenseService.addExpense(expense).subscribe(() => {
        this.expenses.unshift(expense);
        this.expenseForm.reset({
          category: 'accommodations',
          date: new Date().toISOString().substring(0, 10)
        });
        this.updateExpenseSummary();
      });
    }
  }

  deleteExpense(id: string) {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expenseService.deleteExpense(id).subscribe(() => {
        this.expenses = this.expenses.filter(e => e.id !== id);
        this.updateExpenseSummary();
      });
    }
  }

  updateExpenseSummary() {
    this.summary.total = this.expenses.reduce((sum, e) => sum + e.amount, 0);
    this.summary.remaining = this.summary.budget - this.summary.total;
    this.summary.daily = this.budgetForm.value.duration > 0 ? 
      this.summary.total / this.budgetForm.value.duration : 0;
  }

  getCurrencySymbol(currency: string): string {
    return this.budgetService.getCurrencySymbol(currency);
  }

  getCategoryDisplay(category: string): string {
    return this.expenseService.getCategoryDisplay(category);
  }

  logout() {
    this.authService.logout();
  }
}