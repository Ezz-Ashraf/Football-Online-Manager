import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiTags, getSchemaPath, ApiOkResponse } from '@nestjs/swagger'
import { AuthDto } from './dto/auth.dto'
import { ApiResponseDto } from 'src/common/dto/api-response.dto'
import { AuthResponseDto } from './dto/auth.response.dto'
import { ApiAppResponse } from 'src/common/decorators/api-response.decorator'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiAppResponse(AuthResponseDto)
  login(@Body() dto: AuthDto) {
    return this.authService.authenticate(dto.email, dto.password, dto.confirmPassword)
  }
}
