const { Model, Sequelize, DataTypes } = require("sequelize/types");
const sql = new Sequelize('sqlite::memory');
/** @type {REST} */
const drest = require("../index").rest;
class User extends Model{}
User.init({
  dusername: DataTypes.STRING, //discord username
  mcusername: DataTypes.STRING, //minecraft username
  uuid: DataTypes.STRING, //minecraft UUID
  did: DataTypes.STRING //discord user id
}, {sequelize, modelName: 'user'});

User.addUser = async function(did, mcname){
  //get discord name from api
  