import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '../entities/permission.entity';
import { Role } from '../entities/role.entity';

export class UserDetail {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  nickName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  headPic: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  isFrozen: boolean;

  @ApiProperty()
  isAdmin: boolean;

  @ApiProperty()
  createTime: Date;

  @ApiProperty()
  updateTime: Date;

  @ApiProperty()
  roles: Role[];

  @ApiProperty()
  permissions: Permission[];
}
