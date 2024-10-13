import type { Database } from "@db/sqlite";
import type { ApiKey } from "../database/types.ts";
import { DbClient } from "../database/client.ts";
import { toApiKey } from "../database/fmt.ts";

class ApiKeyService {
  constructor(private db: Database) {}

  getApiKeyByValue(value: string): ApiKey | undefined {
    const statement = this.db.prepare(`
      SELECT * 
      FROM api_keys 
      WHERE value = ?`);

    const rows = statement.all(value);

    if (rows.length === 0) return undefined;

    return toApiKey(rows[0]);
  }

  incrementApiKeyUsage(id: number) {
    const statement = this.db.prepare(`
      UPDATE api_keys 
      SET current_usage = current_usage + 1, updated_at = datetime()
      WHERE id = ?
    `);

    statement.run(id);
  }
}


export function createApiKeyService() {
  const db = DbClient.getInstance();
  return new ApiKeyService(db);
}

