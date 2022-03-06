import { Model, Sequelize, DataTypes, ModelCtor, ModelStatic } from "sequelize";
import { client, rest } from "../../index";
import { Routes } from "discord-api-types/v9";
import { javaHash } from "../../utils/uuidHash";
import { addQuery, findQuery } from "./interfaces";

export let Player: ModelStatic<Model<any,any>>;

export function initialize(sequelize: Sequelize){
  Player = sequelize.define("player",{
    dusername: { type: DataTypes.STRING, allowNull: false }, //discord username
    mcusername: { type: DataTypes.STRING, unique: true, allowNull: false }, //minecraft username
    uuid: { type: DataTypes.STRING, unique: true, allowNull: false, primaryKey: true }, //minecraft UUID
    did: { type: DataTypes.STRING, unique: true, allowNull: false, primaryKey: true }, //discord user id
  });
}
export async function addPlayer(options: addQuery): Promise<boolean> {
  //get discord name from api
  const dname = (await client.users.fetch(options.did)).username

  const mcid = javaHash(options.mcusername);

  //add new user to db

  const newUser = await Player.findOrCreate({
    where:{
      did: options.did
    },
    defaults:{
      dusername: dname,
      mcusername: options.mcusername,
      uuid: mcid,
      did: options.did,
    }
    
  });
  if (newUser[1]) {
    //created user
    return true;
  } else {
    //user exists
    return false;
  }
}

export function removePlayer(options: findQuery) {
  if (options.mcusername != undefined) {
    //if player is admin
    //remove player from whitelist
    //remove player from db
  } else {
    //remove player from whitelist
    //remove player from db
  }
}
