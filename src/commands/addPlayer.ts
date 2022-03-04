import { CommandInteraction, InteractionUpdateOptions, MessageComponentInteraction, MessageInteraction } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';


export const data = 
  new SlashCommandBuilder()
  .setName('player').setDescription('Replies with Hello!')
  //add to whitelist
  .addSubcommand(subcommand=>

    subcommand
      .setName("add")
      .setDescription("Adds a player to the whitelist")
      .addStringOption(option => 

        option
        .setName("nickname")
        .setDescription("Minecraft nickname")
        .setRequired(true)))
  
  //remove from whitelist
  .addSubcommand(subcommand=>

    subcommand
      .setName("remove")
      .setDescription("Removes a player from the whitelist")
      .addStringOption(option=>
        
        option
          .setName("nickname")
          .setDescription("Minecraft nickname. If empty - removes command sender if it is on the whitelist.")
          .setRequired(false)))

  //display player information
  .addSubcommand(subcommand=>
    subcommand
      .setName("info")
      .setDescription("Displays info about the player (WIP)")
      .addStringOption(option=>
        option
          .setName("nickname")
          .setDescription("Minecraft nickname. If empty - display info about sender.")
          .setRequired(false))
    );

export async function execute(interaction: CommandInteraction) {
	switch (interaction.options.getSubcommand(true)) {
    case "add":
      //code for add
      break;
    case "remove":
      //code for remove
      break;
    case "info":
      //code for info
      break;
    default:
      break;
  }
}