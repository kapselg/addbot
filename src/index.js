require("dotenv").config();
const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});





const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require("fs")

const commands = [];
const commandFiles = fs.readdirSync('./src/cmd').filter(file => file.endsWith('.js'));

// Place your client and guild ids here
const clientId = '948653319872716811';
const guildId = '734102166259892234';
for (const file of commandFiles) {
	const command = require(`./cmd/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );
		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

client.login(process.env.DISCORD_TOKEN);

module.exports = {rest, client};