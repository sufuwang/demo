import { Role } from './user/entities/role.entity';
import { Permission } from './user/entities/permission.entity';

declare module 'express' {
  interface Request {
    user: {
      userId: string;
      userName: string;
      roles: Role[];
      permissions: Permission[];
    };
  }
}
