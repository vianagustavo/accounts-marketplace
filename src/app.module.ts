import { Module } from '@nestjs/common';
import { AccountsDiscordModule } from './modules/discord/discord.module';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AccountsDiscordModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
