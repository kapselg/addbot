import { CommandInteraction, InteractionUpdateOptions, MessageComponentInteraction, MessageInteraction } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';
import { addPlayer } from "../database/models/Player";
import { client, minTime } from "..";


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
  
	if(interaction.guild && interaction.member){
    const joinDate = <number> (await interaction.guild.members.fetch(interaction.user)).joinedAt?.valueOf()
    const now = new Date().valueOf();
    switch (interaction.options.getSubcommand(true)) {
    
      case "add":
        //check time on server
        if(now - joinDate < minTime.valueOf() && interaction.user.system){
          interaction.reply("🕔 You are on this server for not long enough ")
        }
        //this command option is required
        if(await addPlayer({did: interaction.user.id, guild: interaction.user.id, mcusername: <string>interaction.options.getString("nickname")})){
          interaction.reply("🥳 Sucessfully linked your accounts")
        }else{
          interaction.reply("✅ You already are in the database");
        }
        break;
      case "remove":
        //code for remove
        break;
      case "info":
        //code for info
        break;
    }
  } 
}