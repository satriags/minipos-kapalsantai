// src/products/products.service.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDto) {
    const existingProduct = await this.prisma.product.findFirst({
      where: { name: data.name, deletedAt: null },
    });
    if (existingProduct) {
      throw new ConflictException({
        message: {
          name: ['Product with this name already exists.'],
        },
      });
    }

    const { creatorId, ...otherData } = data;

    const productData: any = {
      ...otherData,
      createdAt: new Date(),
    };

    if (creatorId) {
      productData.creator = {
        connect: { id: creatorId },
      };
    }

    return this.prisma.product.create({
      data: productData,
    });
  }

  async findAll(query: {
    page?: number;
    totalLimit?: number;
    search?: string;
    sortBy?: string;
    orderBy?: 'asc' | 'desc';
    createdBy?: number;
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.totalLimit) || 5;
    const search = query.search?.trim() || '';
    const sortBy = query.sortBy || 'createdAt'; // default sort by field
    const orderBy = query.orderBy?.toLowerCase() === 'asc' ? 'asc' : 'desc'; // default sort order
    const filterCreatedBy = query.createdBy; // default sort by field

    const where = {
      deletedAt: null,
      ...(search && {
        OR: [{ name: { contains: search } }, { desc: { contains: search } }],
      }),
      ...(filterCreatedBy && {
        createdBy: filterCreatedBy,
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [sortBy]: orderBy,
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              photo: true,
              email: true, // sesuaikan field yang kamu perlukan
            },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const from = total === 0 ? null : (page - 1) * limit + 1;
    const to = total === 0 ? null : Math.min(page * limit, total);

    return {
      current_page: page,
      last_page: Math.ceil(total / limit),
      total,
      from,
      to,
      per_page: limit,
      data,
    };
  }

  async findAllList(query: { search?: string; createdBy?: number }) {
    const search = query.search?.trim() || '';

    const where: any = {
      AND: [{ deletedAt: null }],
    };

    if (search) {
      where.AND.push({
        OR: [{ name: { contains: search } }, { desc: { contains: search } }],
      });
    }

    const data = await this.prisma.product.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            photo: true,
            email: true,
          },
        },
      },
    });

    return data;
  }

  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async update(id: number, dto: UpdateProductDto) {
    // Ambil hanya field yang diizinkan
    const { name, price, stock, desc } = dto;

    const updateData = { name, price, stock, desc };

    return this.prisma.product.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number, deletedBy: number) {
    await this.prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: deletedBy,
      },
    });
    return {
      status: 'success',
      message: 'Berhasil menghapus data',
    };
  }
}
