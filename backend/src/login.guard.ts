import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UnLoginException } from './unLogin.filter';

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;
  @Inject(JwtService)
  private jwt: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isRequireLogin = this.reflector.getAllAndOverride('login', [
      context.getClass(),
      context.getHandler(),
    ]);

    if (!isRequireLogin) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    if (!authorization) {
      throw new UnLoginException('请重新登录1');
    }

    try {
      const token = authorization.split(' ')[1];
      request.user = this.jwt.verify(token);
      return true;
    } catch {
      throw new UnLoginException('请重新登录2');
    }
  }
}
