import bcrypt from 'bcrypt';
import { InvalidUserFieldError } from '@/core/errors';

export class UserEntity {
  constructor(
    readonly id: string | undefined,
    readonly email: string,
    readonly name: string,
    readonly password: string
  ) {
    this.validateInvariants();
  }

  private validateInvariants(): void {
    if (this.id && this.id.trim().length === 0) {
      throw new InvalidUserFieldError('id', 'cannot be empty');
    }
    if (!this.email || this.email.trim().length === 0) {
      throw new InvalidUserFieldError('email', 'cannot be empty');
    }
    if (!this.name || this.name.trim().length === 0) {
      throw new InvalidUserFieldError('name', 'cannot be empty');
    }
    if (!this.password || this.password.length === 0) {
      throw new InvalidUserFieldError('password', 'cannot be empty');
    }
  }

  canUpdateProfile(): boolean {
    return true;
  }

  isValid(): boolean {
    try {
      this.validateInvariants();
      return true;
    } catch {
      return false;
    }
  }

  update(fields: Partial<{ email: string; name: string }>): UserEntity {
    return new UserEntity(
      this.id,
      fields.email ?? this.email,
      fields.name ?? this.name,
      this.password
    );
  }

  async comparePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
