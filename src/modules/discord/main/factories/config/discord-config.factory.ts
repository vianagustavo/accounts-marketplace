import { Injectable } from '@nestjs/common';

import {
  DiscordModuleOption,
  DiscordOptionsFactory,
} from '@discord-nestjs/core';
import { GatewayIntentBits, Partials } from 'discord.js';

@Injectable()
export class DiscordConfigFactory implements DiscordOptionsFactory {
  createDiscordOptions(): DiscordModuleOption {
    return {
      token: process.env.DISCORD_TOKEN,
      discordClientOptions: {
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
        partials: [
          Partials.Channel,
          Partials.GuildMember,
          Partials.Message,
          Partials.User,
        ],
      },
    };
  }
}
