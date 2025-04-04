import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { loadCommands } from '../handlers/loadCommands';
import { loadEvents } from '../handlers/loadEvents';
import { Command } from '../interfaces/Command';

export class ExtendedClient extends Client {
  then(_arg0: any) {
      throw new Error('Method not implemented.');
  }
  public commands: Collection<string, Command>;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
      ],
    });

    this.commands = new Collection();
  }

  public async init(): Promise<void> {
    try {
      await loadCommands(this);
      await loadEvents(this);
      await this.login(process.env.TOKEN);
    } catch (error) {
      console.error('Error during bot initialization:', error);
    }
  }
}

export default ExtendedClient;