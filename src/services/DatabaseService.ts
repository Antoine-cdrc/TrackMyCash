import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

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
  private dbName = 'expenses.db';

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  async initialize() {
    try {
      this.db = await this.sqlite.createConnection(
        this.dbName,
        false,
        'no-encryption',
        1,
        false
      );

      await this.db.open();

      // Création de la table des dépenses
      const schema = `
        CREATE TABLE IF NOT EXISTS expenses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          amount REAL NOT NULL,
          category TEXT NOT NULL,
          date TEXT NOT NULL
        );
      `;

      await this.db.execute(schema);
      console.log('Base de données initialisée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la base de données:', error);
      throw error;
    }
  }

  async addExpense(expense: Expense): Promise<number> {
    if (!this.db) throw new Error('Base de données non initialisée');

    const query = `
      INSERT INTO expenses (name, amount, category, date)
      VALUES (?, ?, ?, ?)
    `;

    const result = await this.db.run(query, [
      expense.name,
      expense.amount,
      expense.category,
      expense.date
    ]);


    const lastIdQuery = 'SELECT last_insert_rowid() as id';
    const lastIdResult = await this.db.query(lastIdQuery);
    return lastIdResult.values?.[0]?.id || 0;
  }

  async getExpenses(): Promise<Expense[]> {
    if (!this.db) throw new Error('Base de données non initialisée');

    const query = 'SELECT * FROM expenses ORDER BY date DESC';
    const result = await this.db.query(query);
    return result.values || [];
  }

  async getExpensesByCategory(): Promise<{ category: string; total: number }[]> {
    if (!this.db) throw new Error('Base de données non initialisée');

    const query = `
      SELECT category, SUM(amount) as total
      FROM expenses
      GROUP BY category
    `;

    const result = await this.db.query(query);
    return result.values || [];
  }

  async getTotalExpenses(): Promise<number> {
    if (!this.db) throw new Error('Base de données non initialisée');

    const query = 'SELECT SUM(amount) as total FROM expenses';
    const result = await this.db.query(query);
    return result.values?.[0]?.total || 0;
  }

  async deleteExpense(id: number): Promise<void> {
    if (!this.db) throw new Error('Base de données non initialisée');

    const query = 'DELETE FROM expenses WHERE id = ?';
    await this.db.run(query, [id]);
  }
}

export const databaseService = new DatabaseService(); 