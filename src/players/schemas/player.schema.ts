import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type PlayerDocument = HydratedDocument<Player>

export enum PlayerPosition {
  GK = 'GK',
  DEF = 'DEF',
  MID = 'MID',
  ATT = 'ATT'
}

@Schema({ timestamps: true })
export class Player {
  @Prop({ required: true })
  name: string

  @Prop({ enum: PlayerPosition, required: true })
  position: PlayerPosition

  @Prop({ type: Types.ObjectId , ref : 'Team', required: true })
  teamId: Types.ObjectId

  @Prop({
    type: {
      listed: Boolean,
      price: Number
    },
    default: { listed: false , price:0 }
  })
  market: {
    listed: boolean
    price?: number
  }
}

export const PlayerSchema = SchemaFactory.createForClass(Player)
