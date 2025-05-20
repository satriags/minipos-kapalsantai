import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
  UsePipes,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import * as jwtDecode from 'jwt-decode';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true })) // auto validasi dan buang field aneh
  create(
    @Body() createProductDto: CreateProductDto,
    @Headers('authorization') authHeader: string,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const userInfo: any = jwtDecode.jwtDecode(authHeader);
    if (!userInfo) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const userId = userInfo.id;
    const dataToSave = {
      ...createProductDto,
      createdBy: userId,
    };
    return this.productsService.create(dataToSave);
  }

  @Get()
  findAll(@Query() query, @Headers('authorization') authHeader: string) {
    const userInfo: any = jwtDecode.jwtDecode(authHeader);

    if (!userInfo) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    query.createdBy = userInfo.id;
    return this.productsService.findAll(query);
  }

  @Get('list')
  findAllList(@Query() query, @Headers('authorization') authHeader: string) {
    const userInfo: any = jwtDecode.jwtDecode(authHeader);
    if (!userInfo) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    query.createdBy = userInfo.id;
    return this.productsService.findAllList(query);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const userInfo: any = jwtDecode.jwtDecode(authHeader);
    if (!userInfo) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true })) // auto validasi dan buang field aneh
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Headers('authorization') authHeader: string,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const userInfo: any = jwtDecode.jwtDecode(authHeader);
    if (!userInfo) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const userId = userInfo.id;
    const dataToSave = {
      ...updateProductDto,
      createdBy: userId,
    };
    return this.productsService.update(+id, dataToSave);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const userInfo: any = jwtDecode.jwtDecode(authHeader);
    if (!userInfo) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const userId = userInfo.id;
    return this.productsService.remove(+id, userId);
  }
}
