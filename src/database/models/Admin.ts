import Player from "./Player";
import { javaHash } from "../../utils/uuidHash";
import { AutoIncrement, Column, NotNull, PrimaryKey, Table, Model, AllowNull } from "sequelize-typescript";
import { Col } from "sequelize/types/utils";

@Table
export default class Admin extends Model {
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(false)
  @Column
  dusername: string;
  
  @AllowNull(false)
  @Column
  mcusername: string;

  @AllowNull(false)
  @Column
  uuid: string;
}

/*export function initialize(sequelize: Sequelize) {
  Admin.init(
    {
      dusername: { type: DataTypes.STRING, allowNull: false }, //discord username
      mcusername: { type: DataTypes.STRING, allowNull: false }, //minecraft username
      uuid: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        primaryKey: true,
      }, //minecraft UUID
      did: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        primaryKey: true,
      }, //discord user id
      adminScope: { type: DataTypes.ENUM("discord", "minecraft", "both") },
    },
    { sequelize, modelName: "admin" }
  );
}*/

export async function isAdmin(player: Player) {
  const result = await Admin.findAll({
    where: {
      uuid: javaHash(player.mcusername),
      guild: player.guild,
      did: player.did
    },
  });
  if (result.length > 0) return true;
  return false;
}
