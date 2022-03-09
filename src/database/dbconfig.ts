import * as Admin from "./models/Admin";
import * as Player from "./models/Player";
import { Sequelize } from "sequelize-typescript";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db.sqlite",
  logging: false,
  models: [__dirname + "/models"],
  
});

export async function initDB() {
  console.log(sequelize.models);
  sequelize.sync({force: true});
}
