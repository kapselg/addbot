/* IMPORTANT!
This username => UUID conversion works ONLY for offline servers (non-premium). 
Using it on online servers will result in problems with user identificaion!
*/

import crypto from "crypto";

export function javaHash(input: string): string {
  input = "OfflinePlayer:" + input;
  let md5Bytes = crypto.createHash('md5').update(input).digest();
  md5Bytes[6]  &= 0x0f;  /* clear version        */
  md5Bytes[6]  |= 0x30;  /* set to version 3     */
  md5Bytes[8]  &= 0x3f;  /* clear variant        */
  md5Bytes[8]  |= 0x80;  /* set to IETF variant  */
  //add semicolons
  let simple = md5Bytes.toString('hex');
  
  let o;
  o = [
    simple.slice(0, 8), simple.slice(8, 12), simple.slice(12, 16), simple.slice(16, 20), simple.slice(20)
  ]

  return o.join("-");
}