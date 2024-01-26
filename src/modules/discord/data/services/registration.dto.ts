import { InjectDiscordClient } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';

import { Client, TextChannel, Message, APIEmbed } from 'discord.js';

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

  private async handleRegistrationMessage(message: Message) {
    if (message.author.bot) return;

    const registrationState = this.registrationStates.get(message.author.id);

    console.log({ registrationState });

    if (registrationState) {
      switch (registrationState.step) {
        case 0:
          this.startRegistration(message.author.id, message.channelId);
          break;

        case 1:
          registrationState.data = message.content;
          registrationState.step = 2;
          await this.sendEmbed(
            message.author.id,
            message.channelId,
            'Thanks for providing your name!',
            'What is your age?',
          );
          break;

        case 2:
          registrationState.data = message.content;
          registrationState.step = 3;
          await this.sendEmbed(
            message.author.id,
            message.channelId,
            `Great! You are ${registrationState.data} years old.`,
            'What city are you from?',
          );
          break;

        case 3:
          registrationState.data = message.content;
          this.registrationStates.delete(message.author.id);
          await this.sendEmbed(
            message.author.id,
            message.channelId,
            'teste',
            `Thank you for registering! You are from ${registrationState.data}.`,
          );
          break;

        default:
          break;
      }
    }
  }

  public startRegistration(userId: string, channelId: string) {
    if (!this.registrationStates.has(userId)) {
      this.registrationStates.set(userId, {
        step: 1,
        data: '',
      });

      this.sendEmbed(
        userId,
        channelId,
        "Welcome! Let's start the registration process.",
        'What is your name?',
      );
    }
  }

  private async sendEmbed(
    userId: string,
    channelId: string,
    title: string,
    description: string,
  ) {
    const member = this.client.guilds.cache
      .get('1200235252916957324')
      ?.members.cache.get(userId);

    if (member) {
      const targetChannel = member.guild.channels.cache.get(
        channelId,
      ) as TextChannel;

      if (targetChannel) {
        const embed: APIEmbed = {
          title: title,
          description: description,
          color: 2525,
        };

        const button = {
          type: 1,
          components: [
            {
              type: 2,
              style: 1,
              label: 'Enviar',
              custom_id: 'send_application',
            },
          ],
        };

        await targetChannel.send({
          embeds: [embed],
          components: [button],
        });

        // Await user response
        const collector = targetChannel.createMessageCollector({
          filter: (response) => response.author.id === userId,
          time: 60000, // Set a timeout for user response (60 seconds in this example)
        });

        collector.on('collect', async (response) => {
          await this.handleUserResponse(userId, response.content);

          collector.stop();
        });
      }
    }
  }

  private async handleUserResponse(userId: string, response: string) {
    const registrationState = this.registrationStates.get(userId);

    if (registrationState) {
      switch (registrationState.step) {
        case 1:
          registrationState.data = response;
          registrationState.step = 2;
          break;

        case 2:
          registrationState.data = response;
          registrationState.step = 3;
          break;

        case 3:
          registrationState.data = response;
          this.registrationStates.delete(userId);
          break;

        default:
          break;
      }
    }
  }
}
