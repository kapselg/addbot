import { CommandInteraction, InteractionUpdateOptions, MessageComponentInteraction, MessageInteraction } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';


export const data = new SlashCommandBuilder().setName('addplayer').setDescription('Replies with Hello!');

export async function execute(interaction: CommandInteraction) {
	await interaction.reply('Hello!');
}