import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('Redis')
  private redis: RedisClientType;

  get(key: string) {
    return this.redis.get(key);
  }

  async set(key: string, value: string | number, ttl?: number) {
    await this.redis.set(key, value);
    if (ttl) {
      this.redis.expire(key, ttl);
    }
  }
}
