import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Team, TeamDocument } from '../schemas/team.schema'

export class TeamRepository {
  constructor(
    @InjectModel(Team.name)
    private readonly model: Model<TeamDocument>
  ) {}

  create(userId: Types.ObjectId, name: string) {
    return this.model.create({ userId, name })
  }

  findByUserId(userId: Types.ObjectId) {
    return this.model.findOne({ userId })
  }

    findById(id: Types.ObjectId) {
    return this.model.findById(id)
  }

  updateBudget(teamId: Types.ObjectId, amount: number, session?) {
    return this.model.updateOne(
      { _id: teamId },
      { $inc: { budget: amount } },
      { session }
    )
  }

  updatePlayerCount(teamId: Types.ObjectId, delta: number, session?) {
    return this.model.updateOne(
      { _id: teamId },
      { $inc: { playerCount: delta } },
      { session }
    )
  }
}
