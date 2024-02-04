import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class CronService {
  @Cron(CronExpression.EVERY_5_MINUTES)
  async performHealthCheck(): Promise<void> {
    try {
      await axios.get('http://localhost:3000/health');
    } catch (error) {
      // Handle errors if the health check fails
      console.error('Health Check Error:', error.message);
    }
  }
}
