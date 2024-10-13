import { Database } from "@db/sqlite";
import { Config } from "../config.ts";

const DATABASE_FOLDER = "./data";

export class DbClient {
  private static instance: null | Database = null;

  static getInstance(): Database {
    if (DbClient.instance === null) {
      const config = Config.getInstance();
      const DATABASE_FILE = `${DATABASE_FOLDER}/${config.DATABASE_FILE}`;

      DbClient.instance = new Database(new URL(DATABASE_FILE, import.meta.url));
    }

    return DbClient.instance;
  }
}
