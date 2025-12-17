import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './jwt.strategy'
import { UsersModule } from '../users/users.module'
import { appConfig } from '../config/config'
import { QueueModule } from 'src/bull/bull.module'

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: appConfig.jwt.secret,
      signOptions: { expiresIn: appConfig.jwt.expiresIn }
    }) ,
    QueueModule
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
