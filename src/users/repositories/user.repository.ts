import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from '../schemas/user.schema'
import { IUserRepository } from './user.repository.interface'

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email })
  }

  async create(email: string, password: string): Promise<User> {
    return this.userModel.create({ email, password })
  }
}
