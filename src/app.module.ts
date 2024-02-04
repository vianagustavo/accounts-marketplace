import { Module } from '@nestjs/common';
import { AccountsDiscordModule } from './modules/discord/discord.module';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health.controller';
import { CronService } from './health.service';
import { ScheduleModule } from '@nestjs/schedule';

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
