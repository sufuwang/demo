import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { Permission } from './user/entities/permission.entity';
import { User } from './user/entities/user.entity';
import { Role } from './user/entities/role.entity';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './login.guard';
import { PermissionGuard } from './permission.guard';
import { MeetingRoomModule } from './meeting-room/meeting-room.module';
import { MeetingRoom } from './meeting-room/entities/meeting-room.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  CronExpression,
  ScheduleModule,
  SchedulerRegistry,
} from '@nestjs/schedule';
import { CronJob } from 'cron';
import { join } from 'path';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ClientsModule.register([
      {
        name: 'Micro_Service',
        transport: Transport.TCP,
        options: {
          port: 8888,
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'Book_Package',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:8888',
          package: 'book',
          protoPath: join(__dirname, 'book/book.proto'),
        },
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/.env',
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('jwt_secret'),
          signOptions: {
            expiresIn: '30m',
          },
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          type: 'mysql',
          host: configService.get('mysql_server_host'),
          port: configService.get('mysql_server_port'),
          username: configService.get('mysql_server_username'),
          password: configService.get('mysql_server_password'),
          database: configService.get('mysql_server_database'),
          synchronize: true,
          logging: true,
          entities: [Permission, User, Role, MeetingRoom],
          poolSize: 10,
          connectorPackage: 'mysql2',
          extra: {
            authPlugin: 'sha256_password',
          },
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    RedisModule,
    EmailModule,
    MeetingRoomModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: LoginGuard },
    { provide: APP_GUARD, useClass: PermissionGuard },
  ],
})
export class AppModule implements OnApplicationBootstrap {
  @Inject(AppService)
  private appService: AppService;
  @Inject(SchedulerRegistry)
  private schedulerRegistry: SchedulerRegistry;

  private deleteTasks() {
    console.info('delete tasks');
    const crons = this.schedulerRegistry.getCronJobs();
    crons.forEach((item, key) => {
      item.stop();
      this.schedulerRegistry.deleteCronJob(key);
    });

    const intervals = this.schedulerRegistry.getIntervals();
    intervals.forEach((key) => {
      clearInterval(this.schedulerRegistry.getInterval(key));
      this.schedulerRegistry.deleteInterval(key);
    });

    const timeouts = this.schedulerRegistry.getTimeouts();
    timeouts.forEach((key) => {
      clearTimeout(this.schedulerRegistry.getTimeout(key));
      this.schedulerRegistry.deleteTimeout(key);
    });
  }

  onApplicationBootstrap() {
    setTimeout(this.deleteTasks.bind(this), 5000);
    setTimeout(() => {
      const task = new CronJob(CronExpression.EVERY_5_SECONDS, () => {
        this.appService.testMicroServiceEchoOnly(
          '这是一个动态添加的 cron 任务',
        );
      });
      this.schedulerRegistry.addCronJob('new cron task', task);
      task.start();
    }, 7000);
    setTimeout(this.deleteTasks.bind(this), 15000);
  }
}
