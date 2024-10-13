import type { Database } from "@db/sqlite";
import { DbClient } from "../database/client.ts";
import { toUser } from "../database/fmt.ts";


class UserService {
  constructor(private db: Database){}

  getByUsername(username: string) {
    const statement = this.db.prepare(`
      SELECT * 
      FROM users
      WHERE username = ? 
    `)

    const rows = statement.all(username);

    if(rows.length === 0) return undefined;
    return toUser(rows[0]);
  }
}

export function createUserService() {
  const db = DbClient.getInstance();
  return new UserService(db);
}