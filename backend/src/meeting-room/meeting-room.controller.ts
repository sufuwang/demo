import {
  BadRequestException,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';

@Controller('meeting-room')
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) {}

  @Get('init')
  init() {
    return this.meetingRoomService.initData();
  }

  @Get('list')
  list(
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
    @Query('name') name: string,
    @Query('minCapacity') minCapacity: number,
    @Query('maxCapacity') maxCapacity: number,
    @Query('startTime') startTime: number,
    @Query('endTime') endTime: number,
  ) {
    return this.meetingRoomService.getList({
      pageSize,
      current,
      name,
      minCapacity: +minCapacity,
      maxCapacity: +maxCapacity,
      startTime,
      endTime,
    });
  }
}
