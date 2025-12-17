import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { appConfig } from 'src/config/config'

export type TeamDocument = HydratedDocument<Team>

@Schema({ timestamps: true })
export class Team {
  @Prop({ required: true })
  name: string

  @Prop({ type: Types.ObjectId, required: true, unique: true })
  userId: Types.ObjectId

  @Prop({ default: appConfig.initialBudget })
  budget: number

  @Prop({ default: 0 })
  playerCount: number
}

export const TeamSchema = SchemaFactory.createForClass(Team)
