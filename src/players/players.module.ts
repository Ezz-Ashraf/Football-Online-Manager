import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Player, PlayerSchema } from './schemas/player.schema';
import { PlayerRepository } from './repositories/player.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }])],
  providers: [PlayerRepository],
   exports: [PlayerRepository]
})
export class PlayersModule {}
