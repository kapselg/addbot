import { Model, Sequelize, DataTypes } from "sequelize/types";
import { REST } from '@discordjs/rest';
import {rest} from '../index'
import { Routes } from 'discord-api-types/v9';
import { javaHash } from '../utils/uuidHash';
const sequelize = new Sequelize('sqlite::memory');
interface PlayerOptions{
  did: string,
  mcname: string,
  guild: string
}

export class User extends Model{}
User.init({
  dusername: DataTypes.STRING, //discord username
  mcusername: DataTypes.STRING, //minecraft username
  uuid: DataTypes.STRING, //minecraft UUID
  did: DataTypes.STRING //discord user id
}, {sequelize, modelName: 'user'});

export async function addUser (options: PlayerOptions): Promise<string>{
  //get discord name from api
  const dname = await rest.get(
    Routes.guildMembersSearch(options.guild),
    {body:{
      query: options.did
    }}
  )
  //get minecraft uuid from api
  //TODO: make it cached/get uuid on server by command
  const mcid = javaHash(options.mcname);
  //add new user to db

  const newUser = await User.create({
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
