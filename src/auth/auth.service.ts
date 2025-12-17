import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../users/repositories/user.repository';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    @InjectQueue('team')
    private readonly teamQueue: Queue,
  ) {}

  async authenticate(email: string, password: string, confirmPassword: string) {
    let user = await this.userRepository.findByEmail(email);

    // 🔹 LOGIN
    if (user) {
      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        throw new UnauthorizedException('Invalid email or password');
      }
    }

    // 🔹 REGISTER
    if (!user) {
      if (
        !confirmPassword ||
        password.toString() !== confirmPassword.toString()
      ) {
        throw new ForbiddenException(
          'Fields password and confirmPassword not the the same',
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user = await this.userRepository.create(email, hashedPassword);
      await this.teamQueue.add('create-team', {
        userId: user.id,
      });
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}
