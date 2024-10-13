import type { Database } from "@db/sqlite";
import type { ApiKey } from "../database/types.ts";
import { DbClient } from "../database/client.ts";

class ApiKeyService {
  constructor(private db: Database) {}

  getApiKeyByValue(value: string): ApiKey | undefined {
    const statement = this.db.prepare(`
      SELECT * 
      FROM api_keys 
      WHERE value = ?`);

    const rows = statement.all(value);

    if (rows.length === 0) return undefined;

    return this.toApiKey(rows[0]);
  }

  incrementApiKeyUsage(id: number) {
    const statement = this.db.prepare(`
      UPDATE api_keys 
      SET current_usage = current_usage + 1, updated_at = datetime()
      WHERE id = ?
    `);

    statement.run(id);
  }

  private toApiKey(row: Record<string, unknown>): ApiKey {
    return {
      id: row.id as number,
      name: row.name as string,
      value: row.value as string,
      maxUsage: row.max_usage === null ? undefined : row.max_usage as number,
      currentUsage: row.current_usage as number,
      isActive: (row.is_active as number) === 1,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
      ownerId: row.owner_id as number,
    };
  }
}


export function createApiKeyService() {
  const db = DbClient.getInstance();
  return new ApiKeyService(db);
}

