export interface ChatPersistenceModel {
  id: string;
  userId: string;
  title: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface MessagePersistenceModel {
  id: string;
  chatId: string;
  role: string;
  content: string;
  createdAt?: Date;
  deletedAt?: Date | null;
  metadata?: unknown;
}

export interface UserPersistenceModel {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface FeatureFlagPersistenceModel {
  id: string;
  name: string;
  type: string;
  value: string;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
