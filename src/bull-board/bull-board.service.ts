import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bullmq'
import { Queue } from 'bullmq'
import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { ExpressAdapter } from '@bull-board/express'
import * as express from 'express'

@Injectable()
export class BullBoardService {
  constructor(@InjectQueue('team') private readonly teamQueue: Queue) {}

  setup(app) {
    const serverAdapter = new ExpressAdapter()
    serverAdapter.setBasePath('/admin/queues')

    createBullBoard({
      queues: [new BullMQAdapter(this.teamQueue)],
      serverAdapter
    })

    app.use('/admin/queues', serverAdapter.getRouter())
  }
}
