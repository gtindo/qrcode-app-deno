import { Database } from "jsr:@db/sqlite";

const DATABASE_FILE = "./data/app.db";

export class DbConn {
  private static instance: null | Database = null;

  static getInstance(): Database {
    if (DbConn.instance === null) {
      DbConn.instance = new Database(new URL(DATABASE_FILE, import.meta.url));
    }

    return DbConn.instance;
  }
}
