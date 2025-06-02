import { Subject } from 'rxjs';

export const expenseUpdated = new Subject<void>();

export const notifyExpenseUpdate = () => {
  expenseUpdated.next();
}; 