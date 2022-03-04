import { DataTypes } from "sequelize/types";
import { Sequelize } from "sequelize/types/sequelize";
import { findQuery } from "./interfaces";
import { Player } from "./Player";

const sequelize = new Sequelize('sqlite::memory')



export class Admin extends Player{}
Admin.init({
  dusername: { type: DataTypes.STRING, allowNull: false}, //discord username
  mcusername: {type: DataTypes.STRING, unique: true, allowNull: false}, //minecraft username
  uuid: {type: DataTypes.STRING, unique: true, allowNull: false}, //minecraft UUID
  did: {type: DataTypes.STRING, unique: true, allowNull: false } //discord user id
}, {sequelize, modelName: 'user'});

export async function isAdmin(options: findQuery){
  if(typeof options.mcname !== undefined){
    const result = await Admin.findAll({where: {
      mcusername: options.mcname
    }})
  }
}