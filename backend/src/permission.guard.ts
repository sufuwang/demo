import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user }: Request = context.switchToHttp().getRequest();
    if (!user) {
      return true;
    }

    const apiPermissions = this.reflector.getAllAndOverride<string[]>(
      'permissions',
      [context.getClass(), context.getHandler()],
    );
    if (!apiPermissions || apiPermissions?.length === 0) {
      return true;
    }
    const userPermissions = user.permissions.map(({ code }) => code);
    const index = apiPermissions.findIndex((permission) =>
      userPermissions.includes(permission),
    );

    if (index === -1) {
      throw new UnauthorizedException('您没有访问该接口的权限');
    }

    return true;
  }
}
