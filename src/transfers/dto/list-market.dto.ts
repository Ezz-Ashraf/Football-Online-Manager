import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator'
import { Type } from 'class-transformer'

export class ListMarketDto {
  @IsOptional()
  @IsString()
  playerName?: string

  @IsOptional()
  @IsString()
  teamName?: string

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  page?: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20

 
}

  export  function transformToMarketPlayerDto(player: any) {
  return {
    id: player._id.toString(),
    name: player.name,
    position: player.position,
    teamId: player.teamId._id.toString(),
    teamName: player.teamId?.name || 'Unknown Team',
    price: player.market?.price || 0,
    listed: player.market?.listed || false,
    createdAt: player.createdAt,
    updatedAt: player.updatedAt,
  };
}

  export function createMarketListResponse(
  players: any[],
  total: number,
  page: number,
  limit: number,
) {
  return {
    players: players.map(transformToMarketPlayerDto),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

