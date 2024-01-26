import { Module } from '@nestjs/common';

import { DiscordModule } from '@discord-nestjs/core';

import { DiscordConfigFactory } from './main/factories';
import { DiscordBotGateway } from './main/gateways';
import { BaseInfoCommand } from './data/services/registration.service';
import { RegistrationService } from './data/services/registration.dto';

@Module({
  imports: [
    DiscordModule.forRootAsync({
      useClass: DiscordConfigFactory,
    }),
  ],
  providers: [DiscordBotGateway, BaseInfoCommand, RegistrationService],
  exports: [],
})
export class AccountsDiscordModule {}
