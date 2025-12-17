export interface AppConfig {
  app: {
    port: number
  }
  jwt: {
    secret: string
    expiresIn
  }
  database: {
    mongodb: {
      uri: string
    }
  },
    cache: {
    redis: {
      port: string | number,
      host: string
    }
  },
  initialBudget: string | number ,
  initialNoOfPlayers :string | number ,
  initialNoOfGoalkeepers : string | number ,
  initialNoOfDefenders : string | number ,
  initialNoOfMidfielders : string | number,
  initialNoOfAttackers : string | number
}
