import { Module } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { PlayersModule } from 'src/players/players.module';
import { TeamsModule } from 'src/teams/teams.module';

@Module({
   imports: [PlayersModule, TeamsModule],
  controllers: [TransfersController],
  providers: [TransfersService],
})
export class TransfersModule {}
