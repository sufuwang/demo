import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register.dto';
import { RedisService } from 'src/redis/redis.service';
import { md5 } from '../utils/tools';
import { EmailService } from 'src/email/email.service';
import { LoginUserDto } from './dto/login.dto';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { LoginUserVo } from './vo/user.vo';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserDetail } from './vo/user-detail.vo';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UnLoginException } from 'src/unlogin.filter';

interface _UserFilter extends User {
  pageSize: number;
  current: number;
}
export type UserFilter = Partial<_UserFilter>;

@Injectable()
export class UserService {
  private logger = new Logger();

  @Inject(JwtService)
  private jwt: JwtService;
  @Inject(ConfigService)
  private config: ConfigService;
  @Inject(EmailService)
  private email: EmailService;
  @Inject(RedisService)
  private redis: RedisService;
  @InjectRepository(User)
  private userRepository: Repository<User>;
  @InjectRepository(Role)
  private roleRepository: Repository<Role>;
  @InjectRepository(Permission)
  private permissionRepository: Repository<Permission>;

  private createUserDetailVo(user: User) {
    const vo = new UserDetail();
    vo.roles = [];
    Object.keys(user).forEach((key) => {
      if (key === 'password') {
        return;
      }
      vo[key] = user[key];
    });
    vo.permissions = (user.roles ?? []).map((role) => role.permissions).flat();
    if (vo.roles.length === 0) {
      delete vo.roles;
    }
    if (vo.permissions.length === 0) {
      delete vo.permissions;
    }
    return vo;
  }
  private createUserVo(user: User) {
    const vo = new LoginUserVo();
    vo.userDetail = this.createUserDetailVo(user);
    vo.accessToken = this.jwt.sign(
      {
        userId: user.id,
        userName: user.userName,
        roles: vo.userDetail.roles,
        permissions: vo.userDetail.permissions,
      },
      { expiresIn: this.config.get('jwt_access_token_expires_time') || '30m' },
    );
    vo.refreshToken = this.jwt.sign(
      { userId: user.id },
      { expiresIn: this.config.get('jwt_refresh_token_expires_time') || '7d' },
    );
    return vo;
  }
  private async updateUser<T extends keyof User>(
    id: Request['user']['userId'],
    key: T,
    value: User[T],
  ) {
    if (!key || !value || !id) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userRepository.findOne({
      where: { id: +id },
    });
    if (!user) {
      throw new HttpException(
        `未找到当前用户(userId = ${id})`,
        HttpStatus.BAD_REQUEST,
      );
    }
    user[key] = value;
    return this.createUserDetailVo(await this.userRepository.save(user));
  }
  private async checkCaptcha(data: Record<'email' | 'captcha', string>) {
    const captcha = await this.redis.get(`captcha_${data.email}`);
    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }
    if (data.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }
  }

  async sendCaptcha(email: string) {
    const r = (Math.random() * 10 ** 6).toString().split('.')[0].padEnd(6, '0');
    await this.redis.set(`captcha_${email}`, r, 60 * 5);
    return this.email.send({
      emailType: 'qq',
      from: 'sufuwang <sufu_wang@qq.com>',
      to: email,
      subject: '注册',
      html: `这是您的验证码 <b>${r}</b>, 有效期 5 minute`,
    });
  }

  async register(user: RegisterUserDto) {
    await this.checkCaptcha({ email: user.email, captcha: user.captcha });
    const item = await this.userRepository.findOneBy({
      userName: user.userName,
    });
    if (item) {
      throw new HttpException('用户已经存在', HttpStatus.BAD_REQUEST);
    }
    try {
      return this.userRepository.save({
        ...user,
        password: md5(user.password),
      });
    } catch (e) {
      this.logger.error(e, UserService);
      return '注册失败';
    }
  }

  async login(user: LoginUserDto) {
    // const item = await this.userRepository.findOneBy({
    //   userName: user.userName,
    // });
    const item = await this.userRepository.findOne({
      where: {
        userName: user.userName,
      },
      relations: ['roles', 'roles.permissions'],
    });
    if (!item) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    if (item.password !== md5(user.password)) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }
    return this.createUserVo(item);
  }

  async refresh(token: string) {
    try {
      const item = this.jwt.verify(token);
      const user = await this.userRepository.findOne({
        where: { id: item.userId },
        relations: ['roles', 'roles.permissions'],
      });
      return this.createUserVo(user);
    } catch {
      throw new UnLoginException();
    }
  }

  async getInfo(id: Request['user']['userId']) {
    const user = await this.userRepository.findOne({
      where: { id: +id },
      relations: ['roles', 'roles.permissions'],
    });
    return this.createUserDetailVo(user);
  }

  async updatePassword(id: Request['user']['userId'], body: UpdatePasswordDto) {
    await this.checkCaptcha({ email: body.email, captcha: body.captcha });
    return this.updateUser(id, 'password', md5(body.password));
  }

  async freezeUser(id: Request['user']['userId']) {
    return this.updateUser(id, 'isFrozen', true);
  }

  async userList(options: UserFilter = { pageSize: 100, current: 1 }) {
    if (options.current < 1) {
      throw new HttpException(
        'pagination.current 必须大于 0',
        HttpStatus.BAD_REQUEST,
      );
    }
    const condition: Partial<Record<keyof User, any>> = {};
    if (options.userName) {
      condition.userName = Like(`%${options.userName}%`);
    }
    if (options.nickName) {
      condition.nickName = Like(`%${options.nickName}%`);
    }
    if (options.email) {
      condition.email = Like(`%${options.email}%`);
    }
    const [users, totalCount] = await this.userRepository.findAndCount({
      select: [
        'id',
        'userName',
        'nickName',
        'email',
        'phoneNumber',
        'isFrozen',
        'headPic',
        'createTime',
      ],
      skip: (options.current - 1) * options.pageSize,
      take: options.pageSize,
      where: condition,
    });
    console.info('condition: ', condition, options);
    return { users, totalCount };
  }
}
