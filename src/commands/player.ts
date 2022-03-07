import {
  CommandInteraction,
  InteractionUpdateOptions,
  MessageComponentInteraction,
  MessageInteraction,
} from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import Player from "../database/models/Player";
import { client, minTime } from "..";
import { javaHash } from "../utils/uuidHash";
import { isAdmin } from "../database/models/Admin";

export const data = new SlashCommandBuilder()
  .setName("player")
  .setDescription("Replies with Hello!")
  //add to whitelist
  .addSubcommand((subcommand) =>
    subcommand
      .setName("add")
      .setDescription("Adds a player to the whitelist")
      .addStringOption((option) =>
        option
          .setName("nickname")
          .setDescription("Minecraft nickname")
          .setRequired(true)
      )
  )

  //remove from whitelist
  .addSubcommand((subcommand) =>
    subcommand
      .setName("remove")
      .setDescription("Removes a player from the whitelist")
      .addStringOption((option) =>
        option
          .setName("nickname")
          .setDescription(
            "Minecraft nickname. If empty - removes command sender if it is on the whitelist."
          )
          .setRequired(false)
      )
  )

  //display player information
  .addSubcommand((subcommand) =>
    subcommand
      .setName("info")
      .setDescription("Displays info about the player (WIP)")
      .addStringOption((option) =>
        option
          .setName("nickname")
          .setDescription(
            "Minecraft nickname. If empty - display info about sender."
          )
          .setRequired(false)
      )
  );
export async function execute(interaction: CommandInteraction) {
  if (interaction.guild && interaction.member) {
    const joinDate = <number>(
      (
        await interaction.guild.members.fetch(interaction.user)
      ).joinedAt?.valueOf()
    );
    const now = new Date().valueOf();
    switch (interaction.options.getSubcommand(true)) {

      //add player to db and whitelist
      case "add":
        //check time on server
        if (now - joinDate < minTime.valueOf() && interaction.user.system) {
          interaction.reply("🕔 You are on this server for not long enough ");
        }
        //this command option is required
        if (
          await Player.create({
            did: interaction.user.id,
            guild: interaction.user.id,
            mcusername: interaction.options.getString("nickname")!,
            dusername: interaction.user.username,
            uuid: javaHash(interaction.options.getString("nickname")!),
          })
        ) {
          interaction.reply("🥳 Sucessfully linked your accounts");
        } else {
          interaction.reply("✅ You already are in the database");
        }
        break;


      //remove player from db and whitelist
      case "remove":
        const playerName = interaction.options.getString("mcusername");
        if (playerName) {
          //check if sender wants to remove himself

          const player = await Player.findOne({
            where: {
              mcusername: playerName,
              guild: interaction.guildId,
              did: interaction.guildId,
            },
          });
          if (player)
            if (javaHash(playerName) == player!.uuid) {
              //sender removing himself
              player.destroy();

            } else {
              //sender removing another player
              //check if sender is admin
              if (await isAdmin(player)) {
                player.destroy();
              }
              return "You are not authorized to remove other players";
            }
        } else {
          console.log("nope");
        }
        const remUser = await Player.destroy({
          where: {
            did: interaction.user.id,

          },
        });
        if (remUser > 0) {
          //removed user
          return "✅ You have been removed";
        } else {
          //no such user
          return "You are not registered yet";
        }
        break;
      case "info":
        //code for info
        break;
    }
  }
}
