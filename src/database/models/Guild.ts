import crypto from "crypto";
import { AutoIncrement, BeforeCreate, BeforeUpdate, Column, DataType, Not, NotNull, PrimaryKey, Table, Model, AllowNull } from "sequelize-typescript";

@Table
export default class Guild extends Model{
  @PrimaryKey
  @Column  
  id: number

  @AllowNull(false)
  @Column
  guildId: string

  @AllowNull(false)
  @Column
  mcAdress: string;

  @AllowNull(false)
  @Column
  apiAdress: string;

  @AllowNull(false)
  @Column
  apiKey: string;
}