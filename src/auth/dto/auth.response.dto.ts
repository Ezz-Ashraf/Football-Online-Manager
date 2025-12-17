import { ApiProperty } from '@nestjs/swagger'

class AuthUserDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  email: string
}

export class AuthResponseDto {
  @ApiProperty()
  token: string

  @ApiProperty({ type: AuthUserDto })
  user: AuthUserDto
}
