import axios from "axios";
import { client, mcapi, mckey } from "..";
import { sendCommand } from "../utils/apis";
//get server player count
export async function update(){
  try{
    const playerCount = await axios({
      method: "get",
      url: mcapi + "/players",
      headers: {'key': mckey}
    })
    
    //TODO: add support for multiple servers
       

    if(playerCount.status != 200){
      client.user?.setPresence({activities: [{name: "Server offline"}], status: "dnd"});
      return
    }

    const tps: {data: string} = await sendCommand("tps");
    
    client.user?.setPresence({
      status: "online",
      activities: [
        {name: playerCount.data.length + 
        " players online with " + 
        tps.data.substring(27, tps.data.indexOf(",", 27)) 
        + " TPS on bffmc.csrv.pl", type: "PLAYING"}
    ]
    })
    
  }catch(e){    
    client.user?.setPresence({activities: [{name: "Server offline"}], status: "dnd"});
    return
  } 
}

//get server tps

//get server icon (cache it every day)
