import { AppConfig } from "./config.types";

export const appConfig : AppConfig = {
  app: {
    port: parseInt(process.env.PORT || '3000', 10)
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'dev_jwt_secret_change_me',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  },

  database: {
    mongodb: {
      uri: process.env.MONGO_URI ||
        'mongodb://localhost:27017/nest_app?replicaSet=rs0'
    }
  }
    ,
    cache: {
    redis: {
      port: process.env.REDIS_PORT ||
        6379,
      host: process.env.REDIS_HOST || 'localhost'
    }
  },
  initialBudget: process.env.INITIAL_BUDGET?.toString() || 500_0000,
  initialNoOfPlayers: process.env.INITIAL_NO_OF_PLAYERS?.toString() || '20',
  initialNoOfGoalkeepers: process.env.INITIAL_NO_OF_GOALKEEPERS?.toString() || '3',
  initialNoOfDefenders: process.env.INITIAL_NO_OF_DEFENDERS?.toString() || '6',
  initialNoOfMidfielders: process.env.INITIAL_NO_OF_MIDFIELDERS?.toString() || '6',
  initialNoOfAttackers: process.env.INITIAL_NO_OF_ATTACKERS?.toString() || '5'
}
