import { Module } from '@nestjs/common';

import { DiscordModule } from '@discord-nestjs/core';

import { DiscordConfigFactory } from './main/factories';
import { DiscordBotGateway } from './main/gateways';
import { RegistrationCommand } from './data/services/registration.command';
import { RegistrationService } from './data/services/registration.service';

@Module({
  imports: [
    DiscordModule.forRootAsync({
      useClass: DiscordConfigFactory,
    }),
  ],
  providers: [DiscordBotGateway, RegistrationCommand, RegistrationService],
  exports: [],
})
export class AccountsDiscordModule {}
