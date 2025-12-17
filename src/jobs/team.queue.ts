import { BullModule } from '@nestjs/bullmq'

export const TeamQueueModule = BullModule.registerQueue({
  name: 'team'
})
