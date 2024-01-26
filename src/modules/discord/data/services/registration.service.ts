import { Command, InteractionEvent, Handler } from '@discord-nestjs/core';
import { SlashCommandPipe } from '@discord-nestjs/common';
import { Injectable, Inject } from '@nestjs/common';
import { RegistrationService } from './registration.dto';
import { APIEmbed, ChatInputCommandInteraction } from 'discord.js';

@Command({
  name: 'reg',
  description: 'Anúncio de conta',
})
@Injectable()
export class BaseInfoCommand {
  private readonly allowedChannelId = '1200235253353160807';
  constructor(
    @Inject(RegistrationService)
    private readonly registrationService: RegistrationService,
  ) {}

  @Handler()
  onRegistration(
    @InteractionEvent(SlashCommandPipe) options: ChatInputCommandInteraction,
  ): string {
    if (options.channelId === this.allowedChannelId) {
      this.registrationService.startRegistration(
        options.user.id,
        options.channelId,
      );

      return '**O nosso bot irá te enviar uma mensagem privada.\n Siga as instruções para finalizar o seu anúncio.**';
    }
  }
}
