import { Events, Interaction } from 'discord.js';
import { ExtendedClient } from '../structures/ExtendedClient';

export const event = {
  name: Events.InteractionCreate,
  once: false,

  async execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = (interaction.client as ExtendedClient).commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing command "${interaction.commandName}":`, error);
      await interaction.reply({ content: 'There was an error executing this command!', flags: 64 });
    }
  },
};