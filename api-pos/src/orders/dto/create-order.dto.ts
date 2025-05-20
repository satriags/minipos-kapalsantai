// src/orders/dto/create-order.dto.ts
import { IsArray, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class KeranjangItemDto {
  @IsInt()
  idProduct: number;

  nameProduct: string;
  descProduct: string;
  price: number;
  stockMax: number;
  totalQty: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KeranjangItemDto)
  keranjang: KeranjangItemDto[];

  @IsInt()
  totalBayar: number;
}
