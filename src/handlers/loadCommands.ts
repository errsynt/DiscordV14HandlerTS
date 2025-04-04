import { ApplicationCommandDataResolvable, Collection } from 'discord.js';
import { ExtendedClient } from '../structures/ExtendedClient';
import { readdirSync } from 'fs';
import { join } from 'path';

export async function loadCommands(client: ExtendedClient) {
  client.commands = new Collection();
  const commands: ApplicationCommandDataResolvable[] = [];

  const commandFolders = readdirSync(join(__dirname, '../Commands'));
  for (const folder of commandFolders) {
    const commandFiles = readdirSync(join(__dirname, `../Commands/${folder}`)).filter(file => file.endsWith('.ts'));

    for (const file of commandFiles) {
      try {
        const { command } = await import(join(__dirname, `../Commands/${folder}/${file}`));
        if (!command || !command.data || !command.execute) {
          console.warn(`[ WARNING ] The command file '${file}' is missing a required 'data' or 'execute' property.`);
          continue;
        }

        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
      } catch (error) {
        console.error(`Error loading command '${file}':`, error);
      }
    }
  }

  client.once('ready', async () => {
    try {
      client.guilds.cache.forEach(async (guild) => {
        await guild.commands.set(commands);
      });
      // await client.application?.commands.set(commands);
      // console.log(`** registered ${commands.length} commands.`);
    } catch (error) {
      console.error('Error setting commands for guilds:', error);
    }
  });
}
