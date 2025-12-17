import { Module } from '@nestjs/common'
import { BullBoardService } from './bull-board.service'
import { BullModule } from '@nestjs/bullmq'

@Module({
  imports: [BullModule.registerQueue({ name: 'team' })],
  providers: [BullBoardService],
  exports: [BullBoardService], 
})
export class BullBoardModule {}
