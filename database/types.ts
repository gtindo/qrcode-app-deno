export type User = {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  passwordHash: string;
  passwordSalt: string;
  isAdmin: boolean;
  maxApiKeys?: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ApiKey = {
  id: number;
  ownerId: number;
  name?: string;
  value: string;
  maxUsage?: number;
  currentUsage: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthSession = {
  id: string;
  expiresAt: Date;
  userId: number;
  createdAt: Date;
}
