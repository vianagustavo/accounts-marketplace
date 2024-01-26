import { InjectDiscordClient } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';

import { Client, TextChannel } from 'discord.js';

@Injectable()
export class RegistrationService {
  private registrationStates: Map<string, { step: number; data: string }> =
    new Map();

  constructor(@InjectDiscordClient() private readonly client: Client) {
    this.setup();
  }

  private setup() {
    this.client.on('messageCreate', (message) => {
      this.handleRegistrationMessage(message);
    });
  }

  private handleRegistrationMessage(message) {
    if (!message.author.bot) {
      const registrationState = this.registrationStates.get(message.author.id);

      if (registrationState) {
        switch (registrationState.step) {
          case 1:
            registrationState.data = message.content;
            registrationState.step = 2;
            message.reply(
              `Thanks, ${registrationState.data}! What is your age?`,
            );
            break;

          case 2:
            registrationState.data = message.content;
            registrationState.step = 3;
            message.reply(`Great! What city are you from?`);
            break;

          case 3:
            registrationState.data = message.content;
            this.registrationStates.delete(message.author.id);
            message.reply('Thank you for registering!');
            break;

          default:
            break;
        }
      }
    }
  }

  public startRegistration(userId: string) {
    if (!this.registrationStates.has(userId)) {
      this.registrationStates.set(userId, {
        step: 1,
        data: '',
      });

      this.sendTaggedMessage(
        userId,
        "Welcome! Let's start the registration process. What is your name?",
        '1200412884413456504',
      );
    }
  }
  private sendTaggedMessage(
    userId: string,
    message: string,
    channelId: string,
  ) {
    const member = this.client.guilds.cache
      .get('1200235252916957324')
      ?.members.cache.get(userId);

    if (member) {
      const targetChannel = member.guild.channels.cache.get(
        channelId,
      ) as TextChannel;

      if (targetChannel) {
        targetChannel.send(`${member.user}, ${message}`);
      }
    }
  }
}
