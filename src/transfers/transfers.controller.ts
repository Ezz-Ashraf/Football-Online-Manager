import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  Req,
  Patch,
  Body,
} from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ListPlayerDto } from './dto/update-player-price.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transfers')
export class TransfersController {
  constructor(private readonly service: TransfersService) {}

  @Post(':playerId/list')
  listPlayer(
    @Param('playerId') playerId: string,
    @Body() dto: ListPlayerDto,
    @Req() req,
  ) {
    return this.service.listPlayer(playerId, req.user.userId, dto.price);
  }

  @Patch(':playerId/price')
  updatePrice(
    @Param('playerId') playerId: string,
    @Body() dto: ListPlayerDto,
    @Req() req,
  ) {
    return this.service.updatePrice(playerId, req.user.userId, dto.price);
  }

  @Post(':playerId/unlist')
  unlistPlayer(@Param('playerId') playerId: string, @Req() req) {
    return this.service.unlistPlayer(playerId, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'List players on transfer market' })
  @ApiQuery({ name: 'playerName', required: false, type: String })
  @ApiQuery({ name: 'teamName', required: false, type: String })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of players',
  })
  list(@Query() query) {
    return this.service.listMarket(query);
  }

  @Post(':playerId/buy')
  buy(@Req() req, @Param('playerId') playerId: string) {
    return this.service.buyPlayer(playerId, req.user.userId);
  }
}
