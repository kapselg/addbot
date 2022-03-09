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
import { InferAttributes } from "sequelize/types";
import { player } from "./commands";
import { addPlayer, removePlayer } from "../utils/mcCommands";

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
          return;
        }
        //this command option is required
        const playerInfo = {
          did: interaction.user.id,
          guild: interaction.guildId!,
          mcusername: interaction.options.getString("nickname")!,
          dusername: interaction.user.username,
          uuid: javaHash(interaction.options.getString("nickname")!),
        };
        const result = await Player.findOrCreate({
          where: { did: playerInfo.did, guild: playerInfo.guild },
          defaults: playerInfo,
        });
        if (result[1]) {
          addPlayer(result[0].mcusername);
          interaction.reply("🥳 Sucessfully linked your accounts");
        } else {
          interaction.reply("✅ You already are in the database");
        }

        break;

      //remove player from db and whitelist
      case "remove":
        const playerNameArg = interaction.options.getString("nickname");
        const sendersPlayer = await Player.findOne({
          where: {
            did: interaction.user.id,
            guild: interaction.guildId,
          },
        });
        if (playerNameArg) {
          //check if sender provided username is in the database

          

          if (!sendersPlayer)
            return interaction.reply("No such player in the database");

          if (playerNameArg == sendersPlayer.mcusername) {

            //sender removing himself

            sendersPlayer.destroy();
            removePlayer(playerNameArg);
            //TODO: add confirmation
            return interaction.reply("✅ Your accounts have been unlinked");
          }

          //sender removing another player
          //check if sender is admin

          if (await isAdmin(sendersPlayer)) {
            sendersPlayer.destroy();
            removePlayer(sendersPlayer.mcusername);
            return interaction.reply(
              sendersPlayer.mcusername + " accounts have been unlinked"
            );
          } else {
            return interaction.reply(
              "No permission to unlink another players' accounts!"
            );
          }
        } else {
          //no
          if (sendersPlayer) {
            //remove user
            await sendersPlayer?.destroy();
            removePlayer(sendersPlayer.mcusername);
            return interaction.reply("✅ Your accounts have been unlinked");
          } else {
            //no such user
            return interaction.reply("Your accounts are not linked yet!");
          }
        }

      case "info":
        //code for info
        break;
    }
  }
}
