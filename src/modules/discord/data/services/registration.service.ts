import { InjectDiscordClient } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';

import {
  Client,
  Message,
  APIEmbed,
  User,
  APIEmbedField,
  ForumChannel,
  ComponentType,
} from 'discord.js';
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

  private setup(): void {
    this.client.on('messageCreate', (message) => {
      this.handleRegistrationMessage(message);
    });
  }

  public startRegistration(user: User): void {
    const registrationState = this.registrationStates.get(user.id);

    if (!registrationState) {
      this.registrationStates.set(user.id, {
        step: 1,
        data: { userId: user.id },
      });
    } else {
      (registrationState.step = 1),
        (registrationState.data = { userId: user.id });
    }

    this.sendEmbed(
      user,
      ':reminder_ribbon: Bem-vindo! Vamos começar o anúncio da sua conta. :reminder_ribbon: ',
      'Informe o título do seu anúncio:',
    );
  }

  private async handleRegistrationMessage(message: Message) {
    if (message.author.bot || message.guild) return;

    const messageUser = message.author;

    const registrationState = this.registrationStates.get(messageUser.id);

    if (registrationState) {
      switch (registrationState.step) {
        case 0:
          this.startRegistration(messageUser);
          break;

        case 1:
          registrationState.data.title = message.content;
          registrationState.step = 2;
          await this.sendEmbed(
            messageUser,
            ':loudspeaker: Título cadastrado com sucesso! :loudspeaker:',
            'Informe o GS da conta (apenas números):',
          );
          break;

        case 2:
          registrationState.data.gearscore = message.content;
          registrationState.step = 3;
          await this.sendEmbed(
            messageUser,
            ':loudspeaker: GS cadastrado com sucesso! :loudspeaker: ',
            'Informe o maior level de personagem da conta:',
          );
          break;

        case 3:
          registrationState.data.level = message.content;
          registrationState.step = 4;

          // const selectMenu = new StringSelectMenuBuilder()
          //   .setCustomId(messageUser.id)
          //   .setPlaceholder('Escolha sua classe:')
          //   .addOptions(
          //     bdoClasses.map((bdoClass) =>
          //       new StringSelectMenuOptionBuilder()
          //         .setLabel(bdoClass.label)
          //         .setValue(bdoClass.value),
          //     ),
          //   );

          // const row =
          //   new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
          //     selectMenu,
          //   );

          await this.sendEmbed(
            messageUser,
            ':loudspeaker: Level cadastrado com sucesso! :loudspeaker: ',
            'Informe a classe principal da conta:',
          );

          break;

        case 4:
          registrationState.data.mainClass = message.content;
          registrationState.step = 5;
          await this.sendEmbed(
            messageUser,
            ':loudspeaker: Classe principal cadastrada com sucesso! :loudspeaker: ',
            'Informe o número total de empregadas da conta:',
          );
          break;

        case 5:
          registrationState.data.maids = message.content;
          registrationState.step = 6;
          await this.sendEmbed(
            messageUser,
            ':loudspeaker: Empregadas cadastradas com sucesso! :loudspeaker: ',
            'Informe o(s) cavalo(s) presentes na conta:',
          );
          break;

        case 6:
          registrationState.data.horses = message.content;
          registrationState.step = 7;
          await this.sendEmbed(
            messageUser,
            ':loudspeaker:  Cavalo(s) cadastrado(s) com sucesso! :loudspeaker: ',
            'Informe o preço da conta em reais (apenas números):',
          );
          break;

        case 7:
          registrationState.data.price = message.content;
          registrationState.step = 8;
          await this.sendEmbed(
            messageUser,
            ':loudspeaker:  Preço cadastrado(s) com sucesso! :loudspeaker: ',
            'Informe a descrição com informações adicionais da conta:',
          );
          break;

        case 8:
          registrationState.data.description = message.content;
          await this.sendEmbed(
            messageUser,
            ':loudspeaker:  Descrição cadastrada com sucesso! :loudspeaker: ',
            'Revise as informações da sua conta antes de prosseguir:',
          );

          const fields = this.buildEmbedFields(registrationState.data);

          await this.sendEmbed(
            messageUser,
            `Conta - ${registrationState.data.gearscore} GS`,
            '',
            null,
            messageUser.displayName,
            fields,
          );

          const messageTemplate = await this.sendEmbed(
            messageUser,
            'Descrição:',
            registrationState.data.description,
            true,
          );

          const collector = messageTemplate.createMessageComponentCollector({
            componentType: ComponentType.Button,
            filter: (i) => i.user.id === messageUser.id,
          });

          collector.on('collect', (interaction) => {
            if (interaction.customId === interaction.user.id) {
              const channel = this.client.channels.cache.get(
                process.env.ACCOUNTS_GENERAL_ID,
              ) as ForumChannel;

              this.sendForumMessage(channel, registrationState.data);
              interaction.reply(
                'Conta anunciada com sucesso :white_check_mark: Verifique em https://discord.com/channels/1200235252916957324/1200845764709064835',
              );
            } else if (
              interaction.customId === `${interaction.user.id}cancel`
            ) {
              interaction.reply(
                'Anúncio não publicado :x:  Volte à https://discord.com/channels/1200235252916957324/1200555731062116482 para fazer um novo anúncio.',
              );
            }

            collector.stop();
          });

          this.registrationStates.delete(messageUser.id);
          break;

        default:
          break;
      }
    }
  }

  private async sendEmbed(
    user: User,
    title: string,
    description: string,
    hasButtons?: boolean,
    author?: string,
    fields?: APIEmbedField[],
  ) {
    const member = this.client.guilds.cache
      .get(process.env.GUILD_ID)
      ?.members.cache.get(user.id);

    if (member) {
      const embed: APIEmbed = {
        title: title,
        description: description,
        color: 0x00ffff,
        author: {
          name: author,
        },
        fields,
      };

      const buttons = {
        type: 1,
        components: [
          {
            type: 2,
            style: 3,
            label: 'Enviar',
            custom_id: `${user.id}`,
          },
          {
            type: 2,
            style: 4,
            label: 'Cancelar',
            custom_id: `${user.id}cancel`,
          },
        ],
      };

      return await member.send({
        embeds: [embed],
        components: hasButtons ? [buttons] : null,
      });

      // const collector = sending.createMessageComponentCollector({
      //   componentType: ComponentType.StringSelect,
      //   filter: (i) => i.user.id === user.id,
      // });

      // collector.on('collect', (interaction) => {
      //   interaction.reply('awfwa');
      //   collector.stop();
      // });
    }
  }

  private buildEmbedFields(data: AccountModel): APIEmbedField[] {
    const fields: APIEmbedField[] = [
      {
        name: ':crossed_swords: __**GearScore**__',
        value: data.gearscore,
        inline: true,
      },
      {
        name: ':gem: __**Level**__',
        value: data.level,
        inline: true,
      },
      {
        name: ':scroll: __**Classe Principal**__',
        value: data.mainClass,
        inline: true,
      },
      {
        name: ':woman_fairy: __**Empregadas**__',
        value: data.maids,
        inline: true,
      },
      {
        name: ':horse:  __**Cavalo(s)**__',
        value: data.horses,
        inline: true,
      },
      {
        name: ':moneybag:  __**Preço**__',
        value: data.price,
        inline: true,
      },
    ];

    return fields;
  }

  private sendForumMessage(channel: ForumChannel, data: AccountModel) {
    const embed: APIEmbed = {
      color: 0x00ffff,
      fields: [
        {
          name: ':crossed_swords: __**GearScore**__',
          value: data.gearscore,
          inline: true,
        },
        {
          name: ':scroll: __**Level**__',
          value: data.level,
          inline: true,
        },
        {
          name: ':scroll: __**Classe Principal**__',
          value: data.mainClass,
          inline: true,
        },
        {
          name: ':woman_fairy: __**Empregadas**__',
          value: data.maids,
          inline: true,
        },
        {
          name: ':horse:  __**Cavalo(s)**__',
          value: data.horses,
          inline: true,
        },
        {
          name: ':moneybag:  __**Preço**__',
          value: data.price,
          inline: true,
        },
      ],
    };

    const messageTag = this.buildMessageTags(data.price);

    const embedDescription: APIEmbed = {
      color: 0x00ffff,
      description: data.description,
    };

    channel.threads.create({
      name: data.title,
      message: {
        content: `Anunciado por: <@${data.userId}>`,
        embeds: [embed, embedDescription],
      },
      appliedTags: messageTag.length > 0 ? messageTag : undefined,
    });
  }

  private buildMessageTags(price: string): string[] {
    const parsedPrice = parseFloat(price.replace('.', '').replace(',', '.'));

    if (Number.isNaN(parsedPrice)) return [];

    if (parsedPrice <= 1000) return ['1200921763438133340'];
    if (parsedPrice > 1000 && parsedPrice <= 2000)
      return ['1200921802604548156'];
    if (parsedPrice > 2000 && parsedPrice <= 3000)
      return ['1200921887723757569'];
    if (parsedPrice > 3000 && parsedPrice <= 5000)
      return ['1200921931663298681'];
    if (parsedPrice > 5000) return ['1200921983794299041'];
  }
}
