import type { Database } from "@db/sqlite";
import { DbClient } from "../database/client.ts";


class AuthSessionService {
  constructor(private db: Database){}

  getUserId(id: string) {
    const statement = this.db.prepare(`
      SELECT id, user_id
      FROM auth_sessions
      WHERE id = ? AND expires_at >= datetime(?, 'auto') 
    `)

    const rows = statement.all(id, Date.now())
    
    // There is no user associated to the session
    if(rows.length === 0) return undefined;

    return rows[0].user_id as number;
  }

  /**
   * @returns The number of items deleted
   */
  deleteAllExpired() {
    const statement = this.db.prepare(`
      DELETE auth_sessions
      WHERE expires_at <= datetime(?, 'auto')
    `);

    return statement.run(Date.now());
  }
}


export function createAuthSessionService(){
  const db = DbClient.getInstance();
  return new AuthSessionService(db);
}
