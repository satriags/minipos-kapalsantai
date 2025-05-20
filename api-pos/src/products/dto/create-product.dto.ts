// src/products/dto/create-product.dto.ts
import { Exclude } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama produk wajib diisi.' })
  name: string;

  @IsNumber()
  @Min(0, { message: 'Harga tidak boleh negatif.' })
  price: number;

  @IsNumber()
  @Min(0, { message: 'Stok tidak boleh negatif.' })
  stock: number;

  @IsString()
  @IsOptional()
  desc?: string;

  @IsNumber()
  @IsOptional()
  creatorId?: number;

  @Exclude()
  id?: string;

  @Exclude()
  createdBy?: string;
}
