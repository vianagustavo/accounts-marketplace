import { Module } from '@nestjs/common';
import { AccountsDiscordModule } from './modules/discord/discord.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthController } from './health.controller';
import { CronService } from './cron.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    AccountsDiscordModule,
  ],
  controllers: [HealthController],
  providers: [CronService],
})
export class AppModule {}
