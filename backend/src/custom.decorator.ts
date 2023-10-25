import {
  ExecutionContext,
  SetMetadata,
  createParamDecorator,
} from '@nestjs/common';
import { Request } from 'express';

export const RequireLogin = () => SetMetadata('login', true);
export const RequirePermissions = (permissions: string[]) =>
  SetMetadata('permissions', permissions);

export const User = createParamDecorator(
  (key: keyof Request['user'], context: ExecutionContext) => {
    const { user = null } = context.switchToHttp().getRequest<Request>();
    return user?.[key] ?? user;
  },
);
