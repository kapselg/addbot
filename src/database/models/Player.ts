import {
  Model,
  Sequelize,
  DataTypes,
  ModelCtor,
  ModelStatic,
  InferAttributes,
  InferCreationAttributes,
  DestroyOptions,
  CreationOptional,
} from "sequelize";
import { client, rest } from "../../index";
import { Routes } from "discord-api-types/v9";
import { javaHash } from "../../utils/uuidHash";
import { addQuery, findQuery } from "./interfaces";
import { isAdmin } from "./Admin";

export default class Player extends Model<
  InferAttributes<Player>,
  InferCreationAttributes<Player>
> {
  declare id: CreationOptional<number>;
  declare dusername: string;
  declare mcusername: string;
  declare uuid: string;
  declare did: string;
  declare guild: string;

  
  async getPlayer(options: findQuery): Promise<Player | null> {
    if (options.mcusername) {
      return await Player.findOne({
        where: { uuid: javaHash(options.mcusername), guild: options.guild },
      });
    } else {
      return await Player.findOne({ where: { did: options.did, guild: options.guild } });
    }
  }
  async removePlayer(player: Player): Promise<boolean> {
    if (player.get()) {
      await player.destroy();
      return true;
    }
    return false;
  }
  
}

export function initialize(sequelize: Sequelize) {
  Player.init(
    {
      id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, //id
      dusername: { type: DataTypes.STRING, allowNull: false }, //discord username
      mcusername: { type: DataTypes.STRING, allowNull: false }, //minecraft username
      uuid: {
        type: DataTypes.STRING,
        allowNull: false,
      }, //minecraft UUID
      did: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      guild: {
        type: DataTypes.STRING,
        allowNull: false
      }, //discord user id
    },
    { sequelize, modelName: "player" }
  );
}

export async function addPlayer(options: addQuery): Promise<boolean> {
  //get discord name from api
  const dname = (await client.users.fetch(options.did)).username;

  const mcid = javaHash(options.mcusername);

  //add new user to db

  const newUser = await Player.findOrCreate({
    where: {
      did: options.did,
    },
    defaults: {
      dusername: dname,
      mcusername: options.mcusername,
      uuid: mcid,
      did: options.did,
      guild: options.guild
    },
  });
  if (newUser[1]) {
    //created user
    return true;
  } else {
    //user exists
    return false;
  }
}
