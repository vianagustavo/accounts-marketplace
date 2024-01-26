import { Command, InteractionEvent, Handler } from '@discord-nestjs/core';
import { SlashCommandPipe } from '@discord-nestjs/common';
import { Injectable, Inject } from '@nestjs/common';
import { RegistrationService } from './registration.dto';
import { ChatInputCommandInteraction } from 'discord.js';

@Command({
  name: 'reg',
  description: 'User registration',
})
@Injectable()
export class BaseInfoCommand {
  constructor(
    @Inject(RegistrationService)
    private readonly registrationService: RegistrationService,
  ) {}

  @Handler()
  onRegistration(
    @InteractionEvent(SlashCommandPipe) options: ChatInputCommandInteraction,
  ): string {
    this.registrationService.startRegistration(
      options.user.id,
      '1200235253353160807',
    );

    return 'loro';
  }
}
