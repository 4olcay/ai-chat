import { EntityNotFoundError, InvalidArgumentError } from './domain.error';

export class FeatureFlagNotFoundError extends EntityNotFoundError {
  constructor(identifier: string) {
    super('Feature flag', identifier);
    Object.setPrototypeOf(this, FeatureFlagNotFoundError.prototype);
  }
}

export class InvalidFeatureFlagValueError extends InvalidArgumentError {
  constructor(flagName: string, value: any, reason: string = 'Invalid value for feature flag') {
    super(`FeatureFlag.${flagName}`, reason, { flagName, value });
    Object.setPrototypeOf(this, InvalidFeatureFlagValueError.prototype);
  }
}

export class InvalidFeatureFlagFieldError extends InvalidArgumentError {
  constructor(fieldName: string, reason: string = 'cannot be empty') {
    super(`FeatureFlag.${fieldName}`, reason);
    Object.setPrototypeOf(this, InvalidFeatureFlagFieldError.prototype);
  }
}
