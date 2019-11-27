import { Injectable, Logger } from '@nestjs/common';
import { promisify } from 'util';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private redis = require('redis');
  private client: any;
  private getAsync;
  
  constructor() {
  }

  
}

export interface User {
  name: string;
  firstname: string;
  str: string;
  hausnr: number;
  plz: string;
  ort: string;
}
