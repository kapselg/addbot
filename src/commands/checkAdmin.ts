import {
  CommandInteraction,
  InteractionUpdateOptions,
  MessageComponentInteraction,
  MessageInteraction,
} from "discord.js";

import { SlashCommandBuilder } from "@discordjs/builders";
import { isAdmin } from "../database/models/Admin";
import { isElementAccessExpression } from "typescript";
import Player from "../database/models/Player";

export const data = new SlashCommandBuilder()
  .setName("checkadmin")
  .setDescription(
    "Checks if player is an admin. Command made mainly for testing."
  )
  .addStringOption((option) =>
    option
      .setName("nickname")
      .setDescription(
        "Minecraft nickname. If empty - display info about sender."
      )
  );


export async function execute(interaction: CommandInteraction) {
  let result,
    mcusername = interaction.options.getString("nickname");

  //other player
  if (mcusername && interaction.guildId != null) {
    result = await Player.findOne({
      where: {
        guild: interaction.guildId,
        mcusername: mcusername,
        did: interaction.id
      },
    });
    if (result) {
      interaction.reply(
        interaction.options.getString("nickname") + " is a server admin 🎉"
      );
      return;
    } else {
      interaction.reply(
        interaction.options.getString("nickname") + " is not a server admin"
      );
    }
  }
  //sender
  else if (interaction.guildId != null) {
    result = await Player.findOne({
      where:{
        guild: interaction.guildId,
        did: interaction.user.id,
        
      }
      
    });
    if (result) {
      interaction.reply("You are a server admin 🎉");
      return;
    } else {
      interaction.reply("You are not a server admin!");
    }
  }
}
