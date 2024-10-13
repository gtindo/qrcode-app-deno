import type { Database } from "@db/sqlite";
import type { User } from "../database/types.ts";
import { DbClient } from "../database/client.ts";


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
    return this.toUser(rows[0]);
  }

  private toUser(row: Record<string, unknown>): User {
    return {
      id: row.id as number,
      username: row.username as string,
      firstName: row.first_name as string,
      lastName: row.last_name as string,
      email: row.email as string,
      passwordHash: row.password_hash as string,
      passwordSalt: row.password_salt as string,
      isAdmin: (row.is_admin as number) === 1,
      maxApiKeys: row.max_api_keys as number,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string)
    }
  }
}

export function createUserService() {
  const db = DbClient.getInstance();
  return new UserService(db);
}