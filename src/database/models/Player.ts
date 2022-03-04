import { Model, Sequelize, DataTypes } from "sequelize/types";
import { REST } from '@discordjs/rest';
import {rest} from '../../index'
import { Routes } from 'discord-api-types/v9';
import { javaHash } from '../../utils/uuidHash';
import { isElementAccessExpression } from "typescript";
import { addQuery, findQuery } from "./interfaces";
const sequelize = new Sequelize('sqlite::memory');

export class Player extends Model{}
Player.init({
  dusername: { type: DataTypes.STRING, allowNull: false}, //discord username
  mcusername: {type: DataTypes.STRING, unique: true, allowNull: false}, //minecraft username
  uuid: {type: DataTypes.STRING, unique: true, allowNull: false}, //minecraft UUID
  did: {type: DataTypes.STRING, unique: true, allowNull: false } //discord user id
}, {sequelize, modelName: 'user'});

export async function addUser (options: addQuery): Promise<string>{
  //get discord name from api
  const dname = await rest.get(
    Routes.guildMembersSearch(options.guild),
    {body:{
      query: options.did
    }}
  )

  const mcid = javaHash(options.mcname);

  //add new user to db

  const newUser = await Player.create({
    dusername: dname,
    mcusername: options.mcname,
    uuid: mcid,
    did: options.did
  })
  if(newUser.changed()){
    return "Succesfuly added an user"
  }else{
    return "An error occured!"
  }
}

export async function removePlayer(options: findQuery){
  if(options.mcname != undefined){
    //if player is admin
    //remove player from whitelist
    //remove player from db
  }else{
    //remove player from whitelist
    //remove player from db
  }
}
