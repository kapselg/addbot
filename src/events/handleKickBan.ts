import { GuildMember, PartialGuildMember } from "discord.js";
import { client } from "..";
import Player from "../database/models/Player";

export default async function handleKickBan(
  member: GuildMember | PartialGuildMember
) {
  const lastLog =
    (
      await member.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_KICK" })
    ).entries.first() ||
    (
      await member.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_BAN_ADD" })
    ).entries.first();
  if(!lastLog || lastLog.target?.id != member.id) return
  const result = await Player.destroy({where:{
    did: lastLog.target?.id,
    guild: member.guild.id
  }})
  
  if(result>0) { 
    member.guild.systemChannel?.send("Banned or kicked member " + lastLog.target?.username)
  }
}
