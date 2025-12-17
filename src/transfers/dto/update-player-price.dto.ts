import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min } from 'class-validator'

export class ListPlayerDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  price: number
}
