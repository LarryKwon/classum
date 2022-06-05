import { PolicyHandler } from '../../casl/handlerType';
import { SetMetadata } from '@nestjs/common';

export const CHECK_POLICIES_KEY = 'check_policy';
export const CHECK_DOMAIN_KEY = 'check_domain';
export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
