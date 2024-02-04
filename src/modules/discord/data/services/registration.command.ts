import { Command, InteractionEvent, Handler } from '@discord-nestjs/core';
import { SlashCommandPipe } from '@discord-nestjs/common';
import { Injectable, Inject } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { ChatInputCommandInteraction } from 'discord.js';

@Command({
  name: 'reg',
  description: 'Anúncio de conta',
})
@Injectable()
export class RegistrationCommand {
  private readonly allowedChannelId = '1200555731062116482';
  constructor(
    @Inject(RegistrationService)
    private readonly registrationService: RegistrationService,
  ) {}

  @Handler()
  onRegistration(
    @InteractionEvent(SlashCommandPipe) options: ChatInputCommandInteraction,
  ): string {
    if (options.channelId === this.allowedChannelId) {
      this.registrationService.startRegistration(options.user);

      return '**O nosso bot irá te enviar uma mensagem privada.\n Siga as instruções para finalizar o seu anúncio.**';
    }
  }
}
