import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { errMessage } from '../../../config.json';

export const command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with bot Latency.'),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ flags: 64 });

    try {
      await interaction.editReply(`Websocket heartbeat: ${interaction.client.ws.ping}ms\nRoundtrip latency: ${Date.now() - interaction.createdTimestamp}ms`);
    } catch (error) {
      console.error('Error fetching bot latency:', error);
      await interaction.editReply({ content: errMessage });
    }
  }
};