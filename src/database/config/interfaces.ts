//model types

//query requirements
export interface addQuery{
  did: string,
  mcusername: string,
  guild: string
}

export interface findQuery{
  did?: string,
  mcusername?: string,
  guild: string
}