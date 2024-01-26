import { Module } from '@nestjs/common';
import { AccountsDiscordModule } from './modules/discord/discord.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AccountsDiscordModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
