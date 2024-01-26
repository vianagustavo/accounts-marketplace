import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsDiscordModule } from './modules/discord/discord.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AccountsDiscordModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
