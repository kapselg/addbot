require("dotenv").config();
import { REST } from '@discordjs/rest';
import { InteractionType, Routes } from 'discord-api-types/v9';
const {Client} = require("discord.js");
import { CommandInteraction, Interaction, Intents, Collection } from 'discord.js';
import fs from "fs";
import * as commandModules from './commands/commands';



const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
	client.on("interactionCreate", async (interaction: Interaction)=>{
		if(!interaction.isCommand()) return;
		
		 commands[interaction.commandName].execute(interaction);
	
	})
});

//register commands

const commands = Object(commandModules);
const clientId = '948653319872716811';
const guildId = '734102166259892234';
const commandDescriptions = [];

for (const cmd of Object.values<any>(commands)) {
	commandDescriptions.push(cmd.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN!);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commandDescriptions },
    );
		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

client.login(process.env.DISCORD_TOKEN);

export {rest, client};