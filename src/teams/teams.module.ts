import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from './schemas/team.schema';
import { TeamRepository } from './repositories/team.repository';
import { PlayerRepository } from 'src/players/repositories/player.repository';
import { TeamProcessor } from './processors/team.processor';
import { BullModule } from '@nestjs/bullmq';
import { Player, PlayerSchema } from 'src/players/schemas/player.schema';

@Module({
 imports: [
    BullModule.registerQueue({ name: 'team' }),
    MongooseModule.forFeature([
      { name: Team.name, schema: TeamSchema },
      { name: Player.name, schema: PlayerSchema },
    ]),
  ],
  providers: [
    TeamRepository,
    PlayerRepository,
    TeamProcessor, 
  ],
  exports: [TeamRepository],
})
export class TeamsModule {}
