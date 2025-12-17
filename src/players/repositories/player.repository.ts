import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import {
  Player,
  PlayerDocument,
  PlayerPosition
} from '../schemas/player.schema'

export class PlayerRepository {
  constructor(
    @InjectModel(Player.name)
    private readonly model: Model<PlayerDocument>
  ) {}

  createMany(players: Partial<Player>[]) {
    return this.model.insertMany(players)
  }

  async findMarket(filter: any, skip: number, limit: number) {
    const total = await this.model.countDocuments(filter).exec();
    const players = await this.model
      .find(filter)
      .populate('teamId', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ 'market.price': 1 }) // optional: sort by price ascending
      .lean()
      .exec()
      return {players , total}
  }

  async listForMarket(playerId: Types.ObjectId, price: number) {
  return this.model.updateOne(
    { _id: playerId },
    {
      $set: {
        'market.listed': true,
        'market.price': price,
      },
    },
  )
}

async updateMarketPrice(playerId: Types.ObjectId, price: number) {
  return this.model.updateOne(
    { _id: playerId },
    {
      $set: { 'market.price': price },
    },
  )
}

async unlistFromMarket(playerId: Types.ObjectId) {
  return this.model.updateOne(
    { _id: playerId },
    {
      $set: {
        'market.listed': false,
        'market.price': 0,
      },
    },
  )
}

  findById(id: Types.ObjectId) {
    return this.model.findById(id).populate('teamId','userId')
  }

  movePlayer(
    playerId: Types.ObjectId,
    teamId: Types.ObjectId,
    session
  ) {
    return this.model.updateOne(
      { _id: playerId },
      {
        $set: {
          teamId,
          'market.listed': false,
          'market.price': null
        }
      },
      { session }
    )
  }

  list(playerId: Types.ObjectId, price: number) {
    return this.model.updateOne(
      { _id: playerId },
      {
        $set: {
          'market.listed': true,
          'market.price': price
        }
      }
    )
  }

  unlist(playerId: Types.ObjectId) {
    return this.model.updateOne(
      { _id: playerId },
      {
        $set: { 'market.listed': false }
      }
    )
  }
}
