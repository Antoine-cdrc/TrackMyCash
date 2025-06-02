import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { isPlatform } from '@ionic/react';
import { notifyExpenseUpdate } from './EventService';

export interface Expense {
  id?: number;
  name: string;
  amount: number;
  category: string;
  date: string;
}

class DatabaseService {
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;
  private initialized = false;

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  async initialize() {
    if (this.initialized) return;

    if (isPlatform('hybrid')) {
      try {
        const db = await this.sqlite.createConnection(
          'expenses',
          false,
          'no-encryption',
          1,
          false
        );

        await db.open();
        this.db = db;

        const schema = `
          CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            date TEXT NOT NULL
          );
        `;

        await db.execute(schema);
        this.initialized = true;
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données:', error);
        throw error;
      }
    }
  }

  async addExpense(expense: Expense): Promise<number> {
    await this.initialize();
    if (!this.db) throw new Error('Base de données non initialisée');

    try {
      const result = await this.db.run(
        'INSERT INTO expenses (name, amount, category, date) VALUES (?, ?, ?, ?)',
        [expense.name, expense.amount, expense.category, expense.date]
      );

      if (result.changes?.changes && result.changes.changes > 0) {
        notifyExpenseUpdate();
        // Récupérer l'ID de la dernière insertion
        const lastIdResult = await this.db.query('SELECT last_insert_rowid() as id');
        return lastIdResult.values?.[0]?.id || 0;
      }
      throw new Error('Erreur lors de l\'ajout de la dépense');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la dépense:', error);
      throw error;
    }
  }

  async getExpenses(): Promise<Expense[]> {
    await this.initialize();
    if (!this.db) throw new Error('Base de données non initialisée');

    try {
      const result = await this.db.query('SELECT * FROM expenses ORDER BY date DESC');
      return result.values || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des dépenses:', error);
      throw error;
    }
  }

  async deleteExpense(id: number): Promise<void> {
    await this.initialize();
    if (!this.db) throw new Error('Base de données non initialisée');

    try {
      await this.db.run('DELETE FROM expenses WHERE id = ?', [id]);
      notifyExpenseUpdate();
    } catch (error) {
      console.error('Erreur lors de la suppression de la dépense:', error);
      throw error;
    }
  }

  async getExpensesByCategory(): Promise<{ category: string; total: number }[]> {
    await this.initialize();
    if (!this.db) throw new Error('Base de données non initialisée');

    try {
      const result = await this.db.query(
        'SELECT category, SUM(amount) as total FROM expenses GROUP BY category'
      );
      return result.values || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des dépenses par catégorie:', error);
      throw error;
    }
  }

  async getTotalExpenses(): Promise<number> {
    await this.initialize();
    if (!this.db) throw new Error('Base de données non initialisée');

    try {
      const result = await this.db.query('SELECT SUM(amount) as total FROM expenses');
      return result.values?.[0]?.total || 0;
    } catch (error) {
      console.error('Erreur lors de la récupération du total des dépenses:', error);
      throw error;
    }
  }
}

export const databaseService = new DatabaseService(); 