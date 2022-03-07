import * as Admin from "../models/Admin";
import * as Player from "../models/Player";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db.sqlite",
  logging: false,
});
export async function initDB() {
  Admin.initialize(sequelize);
  Player.initialize(sequelize);
  sequelize.sync({force: true});
}
