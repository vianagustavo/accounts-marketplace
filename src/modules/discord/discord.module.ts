import { Module } from '@nestjs/common';

import { DiscordModule } from '@discord-nestjs/core';

import { DiscordConfigFactory } from './main/factories';
import { DiscordBotGateway } from './main/gateways';

@Module({
  imports: [
    DiscordModule.forRootAsync({
      useClass: DiscordConfigFactory,
    }),
  ],
  providers: [DiscordBotGateway],
  exports: [],
})
export class AccountsDiscordModule {}
