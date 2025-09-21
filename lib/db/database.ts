import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.sqlite');

class Database {
  private db: sqlite3.Database;
  private initialized: Promise<void>;

  constructor() {
    this.db = new sqlite3.Database(dbPath);
    this.initialized = this.init();
  }

  private async init(): Promise<void> {
    const run = promisify(this.db.run.bind(this.db)) as (sql: string) => Promise<sqlite3.RunResult>;
    
    // Create users table
    await run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  private async ensureInitialized(): Promise<void> {
    await this.initialized;
  }

  async createUser(firstName: string, lastName: string, hashedPassword: string): Promise<sqlite3.RunResult> {
    await this.ensureInitialized();
    const run = promisify(this.db.run.bind(this.db)) as (sql: string, params: any[]) => Promise<sqlite3.RunResult>;
    const result = await run(
      'INSERT INTO users (first_name, last_name, password) VALUES (?, ?, ?)',
      [firstName, lastName, hashedPassword]
    );
    return result;
  }

  async getUserByName(firstName: string, lastName: string): Promise<any> {
    await this.ensureInitialized();
    const get = promisify(this.db.get.bind(this.db)) as (sql: string, params: any[]) => Promise<any>;
    const user = await get(
      'SELECT * FROM users WHERE first_name = ? AND last_name = ?',
      [firstName, lastName]
    );
    return user;
  }

  async getUserById(id: number): Promise<any> {
    await this.ensureInitialized();
    const get = promisify(this.db.get.bind(this.db)) as (sql: string, params: any[]) => Promise<any>;
    const user = await get('SELECT * FROM users WHERE id = ?', [id]);
    return user;
  }
}

export const db = new Database();
