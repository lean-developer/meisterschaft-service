import { Injectable, Logger } from '@nestjs/common';
import { promisify } from 'util';

@Injectable()
export class RedisService {
  // private client = require('redis').createClient(process.env.REDIS_URL);
  private client;
  private getAsync;
  private zrangeAsync;
  private hgetallAsync;
  private hmsetAsync; 
  private zaddAsync; 

  constructor() {
    /*
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.zrangeAsync = promisify(this.client.zrange).bind(this.client);
    this.hgetallAsync = promisify(this.client.hgetall).bind(this.client);
    this.hmsetAsync = promisify(this.client.hmset).bind(this.client);
    this.zaddAsync = promisify(this.client.zadd).bind(this.client);
    
    this.client.on('connect', function() { 
    });
    */
  }

  public set(key: string, value: string): void {
    this.client.set(key, value);
  }

  public async get(key: string): Promise<any> {
    const res = await this.getAsync(key);
    return res;
  }

  public async getList(key: string): Promise<any> {
      const res = await this.zrangeAsync(key, 0, -1);
      return res;
  }

  public async getHash(key: string): Promise<any> {
    const res = await this.hgetallAsync(key);
    return res;
  }  

  public async setHash(key: string, fieldValues: Array<HashFieldValue>) {
      for (let fieldValue of fieldValues) {
        await this.hmsetAsync(key, fieldValue.field, fieldValue.value);
      }
  }

  public async setList(key: string, members: Array<string>) {
    let score: number = 1;
    for (let member of members) {
        await this.zaddAsync(key, score, member);
        score++;
    }
  }
}

export interface HashFieldValue {
    field: string;
    value: string;
}
