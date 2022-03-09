import crypto from "crypto";
import { AutoIncrement, BeforeCreate, BeforeUpdate, Column, DataType, Not, NotNull, PrimaryKey, Table } from "sequelize-typescript";
import { InferAttributes, InferCreationAttributes, Model } from "sequelize/types";

@Table
export default class Guild extends Model{
  @Column
  @PrimaryKey
  @AutoIncrement
  @NotNull
  
  id: string

  @Column
  @NotNull
  guildId: string

  @Column
  @NotNull
  mcAdress: string;

  @Column
  @NotNull
  apiAdress: string;

  @Column
  @NotNull
  apiKey: string;
}