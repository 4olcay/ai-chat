import { IsString, IsNotEmpty } from 'class-validator';

export interface CreateFeatureFlagDto {
  name: string;
  type: string;
  value: string;
  description?: string;
}

export interface UpdateFeatureFlagDto {
  value?: string;
  description?: string;
}

export interface FeatureFlagResponse {
  id: string;
  name: string;
  type: string;
  value: string;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class FlagParamDto {
  @IsString()
  @IsNotEmpty()
  flagName!: string;
}
