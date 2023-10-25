import {
  Controller,
  Post,
  Body,
  Query,
  Get,
  Headers,
  DefaultValuePipe,
  ParseIntPipe,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { UserService, UserFilter } from './user.service';
import { RegisterUserDto } from './dto/register.dto';
import { LoginUserDto } from './dto/login.dto';
import { RequireLogin, RequirePermissions, User } from '../custom.decorator';
import { Request } from 'express';
import { UpdatePasswordDto } from './dto/update-password.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserDetail } from './vo/user-detail.vo';

@ApiTags('User Module')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiQuery({
    name: 'email',
    type: String,
    description: '邮箱地址',
    required: true,
    example: 'sufuwang0818@gmail.com',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '发送成功',
    type: String,
  })
  @Get('captcha.get')
  sendCaptcha(@Query('email') email: string) {
    return this.userService.sendCaptcha(email);
  }

  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/验证码不正确/用户已存在',
    type: UserDetail,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '注册成功/失败',
    type: UserDetail,
  })
  @Post('register')
  register(@Body() registerUser: RegisterUserDto) {
    return this.userService.register(registerUser);
  }

  @Post('login')
  login(@Body() loginUser: LoginUserDto) {
    return this.userService.login(loginUser);
  }

  @Get('refresh')
  // @SetMetadata('login', true)
  // @SetMetadata('permissions', ['auth'])
  @ApiBearerAuth()
  @RequireLogin()
  @RequirePermissions(['auth'])
  refresh(@Headers('Authorization') token = '', @User() user: Request['user']) {
    console.info('user: ', user);
    return this.userService.refresh(token.split(' ')[1]);
  }

  @Get('info')
  @ApiBearerAuth()
  @ApiQuery({
    name: 'userId',
    type: String,
    description: '用户 ID',
    required: true,
    example: '7',
  })
  @RequireLogin()
  getInfo(@User('userId') userId: Request['user']['userId']) {
    return this.userService.getInfo(userId);
  }

  @Post('update.password')
  @ApiBearerAuth()
  @RequireLogin()
  @RequirePermissions(['auth'])
  updateInfo(
    @User('userId') userId: Request['user']['userId'],
    @Body() body: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(userId, body);
  }

  @Get('freeze')
  @ApiBearerAuth()
  @RequireLogin()
  @RequirePermissions(['freeze'])
  freezeUser(@Query('userId') userId: Request['user']['userId']) {
    return this.userService.freezeUser(userId);
  }

  @Post('list')
  @ApiBearerAuth()
  @RequireLogin()
  @RequirePermissions(['all'])
  userListPost(@Body() options: UserFilter) {
    return this.userService.userList(options);
  }

  @Get('list')
  @ApiBearerAuth()
  @RequireLogin()
  @RequirePermissions(['all'])
  userListGet(
    @Query(
      'pageSize',
      new DefaultValuePipe(0),
      new ParseIntPipe({
        exceptionFactory() {
          throw new BadRequestException('pageSize 应该传数字');
        },
      }),
    )
    pageSize: number,
    @Query(
      'current',
      new DefaultValuePipe(1),
      new ParseIntPipe({
        exceptionFactory() {
          throw new BadRequestException('current 应该传数字');
        },
      }),
    )
    current: number,
    @Query('userName') userName: string,
    @Query('nickName') nickName: string,
    @Query('email') email: string,
  ) {
    return this.userService.userList({
      pageSize,
      current,
      userName,
      nickName,
      email,
    });
  }
}
