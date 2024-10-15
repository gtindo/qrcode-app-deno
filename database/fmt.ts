import { ApiKey, User } from "./types.ts";

export function toUser(row: Record<string, unknown>): User {
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
    updatedAt: new Date(row.updated_at as string),
  };
}

export function toApiKey(row: Record<string, unknown>): ApiKey {
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
