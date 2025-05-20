import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import * as jwtDecode from 'jwt-decode';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('create')
  create(@Body() body, @Headers('authorization') authHeader: string) {
    const userInfo: any = jwtDecode.jwtDecode(authHeader);
    if (!userInfo?.id) {
      throw new UnauthorizedException('Invalid token');
    }
    return this.ordersService.create(body, userInfo.id);
  }

  @Get('transaction')
  getAll(@Headers('authorization') authHeader: string) {
    const userInfo: any = jwtDecode.jwtDecode(authHeader);
    if (!userInfo?.id) {
      throw new UnauthorizedException('Invalid token');
    }
    return this.ordersService.getAllTransaction(userInfo.id);
  }

  @Post('change-status')
  changeStatus(
    @Body() createOrderDto: CreateOrderDto,
    @Headers('authorization') authHeader: string,
  ) {
    const userInfo: any = jwtDecode.jwtDecode(authHeader);
    if (!userInfo?.id) {
      throw new UnauthorizedException('Invalid token');
    }
    return this.ordersService.create(createOrderDto, userInfo.id);
  }
}
