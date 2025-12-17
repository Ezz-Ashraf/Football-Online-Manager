import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose'
import { appConfig } from './config/config';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { PlayersModule } from './players/players.module';
import { TransfersModule } from './transfers/transfers.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { QueueModule } from './bull/bull.module';
import { BullBoardModule } from './bull-board/bull-board.module';


@Module({
  imports: [MongooseModule.forRoot(appConfig.database.mongodb.uri), BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get('REDIS_HOST', appConfig.cache.redis.host),
          port: +config.get('REDIS_PORT',appConfig.cache.redis.port )
        }
      }),
      inject: [ConfigService]
    }),
   QueueModule,AuthModule, UsersModule, TeamsModule, PlayersModule, TransfersModule, BullModule , BullBoardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
