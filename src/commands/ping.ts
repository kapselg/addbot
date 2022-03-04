import { CommandInteraction, InteractionUpdateOptions, MessageComponentInteraction, MessageInteraction } from "discord.js";

import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from "./interface";


export const data = new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!');

export async function execute(interaction: CommandInteraction) {
		await interaction.reply('Pong!');
}