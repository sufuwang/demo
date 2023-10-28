import { BadRequestException, Injectable } from '@nestjs/common';
import { MeetingRoom } from './entities/meeting-room.entity';
import { Between, FindOperator, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

interface _ListFilter {
  pageSize: number;
  current: number;
  name: string;
  minCapacity: number;
  maxCapacity: number;
  startTime: number;
  endTime: number;
}
export type ListFilter = Partial<_ListFilter>;

@Injectable()
export class MeetingRoomService {
  @InjectRepository(MeetingRoom)
  private meetingRootRepository: Repository<MeetingRoom>;

  initData() {
    const d = Date.now();
    const rooms = ['a', 'b', 'c', 'd'].map((item, index) => {
      const room = new MeetingRoom();
      room.name = `name_${item}_${d}`;
      room.capacity = index;
      room.equipment = `equipment_${item}_${d}`;
      room.location = `location_${item}_${d}`;
      return room;
    });
    return this.meetingRootRepository.save(rooms);
  }

  async getList(listFilter: ListFilter) {
    const {
      pageSize,
      current,
      name,
      minCapacity,
      maxCapacity,
      startTime,
      endTime,
    } = listFilter;
    console.info('listFilter: ', listFilter);
    if (current < 1 || minCapacity > maxCapacity) {
      throw new BadRequestException('参数错误');
    }
    const condition: Partial<Record<keyof MeetingRoom, FindOperator<any>>> = {};
    if (name) {
      condition.name = Like(`%${name.replaceAll('_', '\\_')}%`);
    }
    if (minCapacity >= 0 && maxCapacity >= 0) {
      condition.capacity = Between(minCapacity, maxCapacity);
    }
    if (startTime && endTime) {
      condition.createTime = Between(new Date(startTime), new Date(endTime));
    }
    const [rooms, totalCount] = await this.meetingRootRepository.findAndCount({
      skip: (current - 1) * pageSize,
      take: pageSize,
      where: condition,
    });
    return { rooms, totalCount };
  }
}
