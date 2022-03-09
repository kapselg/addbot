require("dotenv").config();
import { REST } from '@discordjs/rest';
import { InteractionType, Routes } from 'discord-api-types/v9';
import { CommandInteraction, Interaction, Intents, Collection, Client } from 'discord.js';
import fs from "fs";
import * as commandModules from './commands/commands';
import { initDB } from './database/config/dbconfig';
import handleKickBan from './events/handleKickBan';
import { update } from './events/richPresence';

const minTime = new Date(<number> <unknown>process.env.MINIMUM_TIME * 1000);
const mckey = process.env.MCAPI_KEY || "error"
const mcapi = "http://" + process.env.MCAPI_URL + ":4567/v1";
const client: Client = new Client({ intents: [Intents.FLAGS.GUILDS] });
let serverStatus: boolean;

client.once('ready', async() => {
  console.log(`Logged in as ${client.user?.tag}!`);
	initDB();
	serverStatus = await update();
	setInterval(async()=>{serverStatus = await update()}, 10000);
	if(serverStatus){
		client.on("interactionCreate", async (interaction: Interaction)=>{
			if(!interaction.isCommand()) return;
			
			 commands[interaction.commandName].execute(interaction);
		})
		client.on("guildMemberRemove", handleKickBan);
	}
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

export {rest, client, mcapi, mckey, minTime};