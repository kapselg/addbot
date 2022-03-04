import axios, { AxiosResponse } from "axios";
require("dotenv").config();
import qs from "querystring";
import { mckey } from "..";

export async function sendCommand(command: string): Promise<AxiosResponse>{
  return await axios({
    method: "post",
    url: "http://s802237.csrv.pl:4567/v1/server/exec",
    headers: {
      "key": mckey,
      "content-type": 'application/x-www-form-urlencoded'
    },
    data: qs.stringify({
      "command": command
    })
  })
}
