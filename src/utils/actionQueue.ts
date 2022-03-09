import { Collection, Interaction, SnowflakeUtil } from "discord.js";

/**
 * Manager of all guilds' queues
 */
class QueueManager {
  private guildList: Map<string, GuildQueue> = new Map();

  constructor() {
    return this;
  }

  getGuildQueue(guildId: string){
    return this.guildList.get(guildId);
  }

  addGuildQueue(queue: GuildQueue){
    this.guildList.set(queue.guildId, queue);
  }
}

/**
 * List of commands sent from a guild while the Minecraft server was down
 */
class GuildQueue {
  queue: Map<string, QueueItem> = new Map();
  guildId: string

  constructor(guildId:string) {
    this.guildId = guildId;
    return this
  }

  addQueueItem(QueueItem: QueueItem){
    this.queue.set(QueueItem.queueId, QueueItem);
  }
}

/**
 * Single command queued to be executed on Minecraft server start
 */
class QueueItem {
  interaction: Interaction;
  commandName: string;
  queueId: string;

  constructor(interaction: Interaction, commandName: string) {
    this.interaction = interaction;
    this.commandName = commandName;
    this.queueId = SnowflakeUtil.generate();
  }
}
