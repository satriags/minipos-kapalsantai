import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { Exclude } from 'class-transformer';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'Nama produk tidak boleh kosong jika diisi.' })
  name?: string;

  @IsNumber()
  @Min(0, { message: 'Harga tidak boleh negatif.' })
  @IsOptional()
  price?: number;

  @IsNumber()
  @Min(0, { message: 'Stok tidak boleh negatif.' })
  @IsOptional()
  stock?: number;

  @IsString()
  @IsOptional()
  desc?: string;

  @IsNumber()
  @IsOptional()
  updaterId?: number; // kalau kamu mau simpan siapa yang update, kayak creatorId di create

  @Exclude()
  createdBy?: string;
}
