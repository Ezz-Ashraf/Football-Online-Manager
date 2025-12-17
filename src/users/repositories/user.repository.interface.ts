import { User } from '../schemas/user.schema'

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>
  create(email: string, password: string): Promise<User>
}
