import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class CronService {
  @Cron(CronExpression.EVERY_MINUTE)
  async performHealthCheck(): Promise<void> {
    console.log('chamou');
    try {
      const response = await axios.get(
        'https://accounts-marketplace.onrender.com/health',
      );

      console.log('Health Check Response:', response.data);
    } catch (error) {
      console.error('Health Check Error:', error.message);
    }
  }
}
