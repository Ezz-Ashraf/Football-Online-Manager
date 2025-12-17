import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common'
import { Connection, Types } from 'mongoose'
import { InjectConnection } from '@nestjs/mongoose'
import { PlayerRepository } from '../players/repositories/player.repository'
import { TeamRepository } from '../teams/repositories/team.repository'
import { createMarketListResponse, ListMarketDto } from './dto/list-market.dto'

@Injectable()
export class TransfersService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly playerRepo: PlayerRepository,
    private readonly teamRepo: TeamRepository
  ) {}

   async listMarket(query: ListMarketDto) {
    const filter: any = { 'market.listed': true }

    // Only add safe filters
    if (query.playerName) {
      filter.name = { $regex: query.playerName, $options: 'i' }
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      filter['market.price'] = {}
      if (query.minPrice !== undefined) filter['market.price'].$gte = query.minPrice
      if (query.maxPrice !== undefined) filter['market.price'].$lte = query.maxPrice
    }

    // Optional: filter by teamName via aggregation if needed
    if (query.teamName) {
      // Use safe aggregation lookup
      filter['team.name'] = { $regex: query.teamName, $options: 'i' }
    }

    const page = query.page || 1
    const limit = query.limit || 20
    const skip = (page - 1) * limit

    // Execute query
    const {players,total} = await this.playerRepo.findMarket(filter, skip, limit)

    return createMarketListResponse(players,total, page, limit)
  }


  async buyPlayer(playerId: string, buyerUserId: string) {
    const session = await this.connection.startSession()
    session.startTransaction()

    try {
      const player = await this.playerRepo.findById(
        new Types.ObjectId(playerId)
      )

      if (!player?.market.listed || !player?.market.price) {
        throw new BadRequestException('Player not for sale')
      }

      const price = Math.floor(player.market.price * 0.95)

     const buyer = await this.teamRepo.findByUserId(new Types.ObjectId(buyerUserId))
if (!buyer) throw new BadRequestException('Buyer team not found')

const seller = await this.teamRepo.findById(player.teamId._id)
if (!seller) throw new BadRequestException('Seller team not found')

if (buyer.playerCount >= 25) throw new BadRequestException('Team full')
if (seller.playerCount <= 15) throw new BadRequestException('Seller team too small')
if (buyer.budget < price) throw new BadRequestException('Insufficient funds')

await this.teamRepo.updateBudget(buyer._id, -price, session)
await this.teamRepo.updateBudget(seller._id, price, session)

await this.teamRepo.updatePlayerCount(buyer._id, 1, session)
await this.teamRepo.updatePlayerCount(seller._id, -1, session)

await this.playerRepo.movePlayer(player._id, buyer._id, session)

      await session.commitTransaction()
    } catch (e) {
      await session.abortTransaction()
      console.log(e)
      throw e
    } finally {
      session.endSession()
    }
  }

  async listPlayer(
    playerId: string,
    userId: string,
    price: number,
  ) {
    const player = await this.playerRepo.findById(
      new Types.ObjectId(playerId),
    )

    if (!player) throw new BadRequestException('Player not found')

    const team = await this.teamRepo.findByUserId(
      new Types.ObjectId(userId),
    )

    if (!team) throw new BadRequestException('Team not found')

    if (!player.teamId.equals(team._id)) {
      throw new ForbiddenException('You do not own this player')
    }

    if (player.market.listed) {
      throw new BadRequestException('Player already listed')
    }

    await this.playerRepo.listForMarket(player._id, price)

    return { success: true }
  }

  async updatePrice(
    playerId: string,
    userId: string,
    price: number,
  ) {
    const player = await this.playerRepo.findById(
      new Types.ObjectId(playerId),
    )

    if (!player?.market.listed) {
      throw new BadRequestException('Player is not listed')
    }

    const team = await this.teamRepo.findByUserId(
      new Types.ObjectId(userId),
    )



    if (!team || !player.teamId.equals(team._id)) {
      throw new ForbiddenException('You do not own this player')
    }

    await this.playerRepo.updateMarketPrice(player._id, price)

    return { success: true }
  }

  async unlistPlayer(
    playerId: string,
    userId: string,
  ) {
    const player = await this.playerRepo.findById(
      new Types.ObjectId(playerId),
    )

    if (!player?.market.listed) {
      return { success: true } // idempotent
    }

    const team = await this.teamRepo.findByUserId(
      new Types.ObjectId(userId),
    )

    if (!team || !player.teamId.equals(team._id)) {
      throw new ForbiddenException('You do not own this player')
    }

    await this.playerRepo.unlistFromMarket(player._id)

    return { success: true }
  }

}
