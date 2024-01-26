import { InjectDiscordClient } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';

import { Client, Message, APIEmbed } from 'discord.js';
import { AccountModel } from '../models/account.model';

@Injectable()
export class RegistrationService {
  private registrationStates: Map<
    string,
    { step: number; data: AccountModel }
  > = new Map();

  constructor(@InjectDiscordClient() private readonly client: Client) {
    this.setup();
  }

  private setup() {
    this.client.on('messageCreate', (message) => {
      this.handleRegistrationMessage(message);
    });
  }

  private async handleRegistrationMessage(message: Message) {
    if (message.author.bot || message.guild) return;

    const registrationState = this.registrationStates.get(message.author.id);

    if (registrationState) {
      switch (registrationState.step) {
        case 0:
          this.startRegistration(message.author.id, message.channelId);
          break;

        case 1:
          registrationState.data.gearscore = message.content;
          registrationState.step = 2;
          await this.sendEmbed(
            message.author.id,
            'GS cadastrado com sucesso!',
            'Informe o personagem de maior level da conta:',
          );
          break;

        case 2:
          registrationState.data.level = message.content;
          registrationState.step = 3;
          await this.sendEmbed(
            message.author.id,
            'Level cadastrado com sucesso!',
            'Informe o(s) cavalo(s) presentes na conta:',
          );
          break;

        case 3:
          registrationState.data.horses = message.content;
          registrationState.step = 4;
          await this.sendEmbed(
            message.author.id,
            'Cavalo(s) cadastrado(s) com sucesso!',
            'Informe a descrição com informações adicionais da conta:',
            true,
          );
          break;

        case 4:
          registrationState.data.horses = message.content;
          console.log({ registrationState });
          this.registrationStates.delete(message.author.id);
          await this.sendEmbed(
            message.author.id,
            'Descrição cadastrado(s) com sucesso!',
            'Revise as informações da sua conta antes de prosseguir:',
            true,
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
        data: {},
      });

      this.sendEmbed(
        userId,
        'Bem-vindo! Vamos começar o anúncio da sua conta.',
        'Informe o GS da conta:',
      );
    }
  }

  private async sendEmbed(
    userId: string,
    title: string,
    description: string,
    hasButton?: boolean,
  ) {
    const member = this.client.guilds.cache
      .get('1200235252916957324')
      ?.members.cache.get(userId);

    if (member) {
      const embed: APIEmbed = {
        title: title,
        description: description,
        color: 0x00ffff,
      };

      const buttons = [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 3,
              label: 'Enviar',
              custom_id: `${userId}`,
            },
            {
              type: 2,
              style: 4,
              label: 'Cancelar',
              custom_id: `${userId}cancel`,
            },
          ],
        },
      ];

      await member.send({
        embeds: [embed],
        components: hasButton ? buttons : null,
      });
    }
  }
}
