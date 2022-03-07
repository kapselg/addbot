import { sendCommand } from "./apis";

export async function addPlayer(player: string){
  if(await sendCommand("whitelist add " + player)) return true
  return false
}

export async function removePlayer(player: string){
  if(await sendCommand("whitelist remove " + player)) return true
  return false
}