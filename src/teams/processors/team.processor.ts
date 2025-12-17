import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { Types } from 'mongoose'
import { TeamRepository } from '../repositories/team.repository'
import { PlayerRepository } from '../../players/repositories/player.repository'
import { Player, PlayerPosition } from '../../players/schemas/player.schema'
import { appConfig } from 'src/config/config'

@Processor('team', { concurrency: 5 })
export class TeamProcessor extends WorkerHost {
  constructor(
    private readonly teamRepo: TeamRepository,
    private readonly playerRepo: PlayerRepository
  ) {
    super()
  }

  async process(job: Job<{ userId: string }>) {
    if (job.name !== 'create-team') return

    const userId = new Types.ObjectId(job.data.userId)

    const team = await this.teamRepo.create(
      userId,
      `Team-${userId.toHexString().slice(-5)}`
    )

    const roster = {
      [PlayerPosition.GK]: appConfig.initialNoOfGoalkeepers,
      [PlayerPosition.DEF]: appConfig.initialNoOfDefenders,
      [PlayerPosition.MID]: appConfig.initialNoOfMidfielders,
      [PlayerPosition.ATT]: appConfig.initialNoOfAttackers
    }

    const players : Player[] = []

    for (const [position, count] of Object.entries(roster)) {
      for (let i = 0; i < parseInt(count.toString()); i++) {
        const pos = position as PlayerPosition
        players.push({
            name: `${position}-${i + 1}`,
            position: pos,
            teamId: team._id,
            market: {
                listed: false,
                price: 0
            }
        })
      }
    }

    await this.playerRepo.createMany(players)
    await this.teamRepo.updatePlayerCount(team._id, players.length)
  }
}
