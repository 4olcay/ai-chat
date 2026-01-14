import { InvalidFeatureFlagFieldError } from '@/core/errors';

export class FeatureFlagEntity {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly type: string,
    readonly value: string,
    readonly description?: string | null,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {
    this.validateInvariants();
  }

  private validateInvariants(): void {
    if (!this.id || this.id.trim().length === 0) {
      throw new InvalidFeatureFlagFieldError('id', 'cannot be empty');
    }
    if (!this.name || this.name.trim().length === 0) {
      throw new InvalidFeatureFlagFieldError('name', 'cannot be empty');
    }
    if (!this.type || this.type.trim().length === 0) {
      throw new InvalidFeatureFlagFieldError('type', 'cannot be empty');
    }
    if (!this.value || this.value.trim().length === 0) {
      throw new InvalidFeatureFlagFieldError('value', 'cannot be empty');
    }
  }

  isValid(): boolean {
    try {
      this.validateInvariants();
      return true;
    } catch {
      return false;
    }
  }

  isEnabled(): boolean {
    return this.value === 'true' || this.value === '1';
  }
}
