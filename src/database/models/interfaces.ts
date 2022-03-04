export interface addQuery{
  did: string,
  mcname: string,
  guild: string
}

export interface findQuery{
  did: string | undefined,
  mcname: string | undefined,
  guild: string
}