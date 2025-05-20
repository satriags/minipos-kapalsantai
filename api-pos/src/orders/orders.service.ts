import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(body, userId: number) {
    const { keranjang, totalBayar } = body;

    try {
      return await this.prisma.$transaction(async (tx) => {
        const invoice = `INV-${Date.now()}`;

        const order = await tx.order.create({
          data: {
            userId,
            invoice,
            totalBayar,
            createdBy: userId,
          },
        });

        const orderItems = keranjang.map((item) => ({
          orderId: order.id,
          productId: item.idProduct,
          nameProduct: item.nameProduct,
          descProduct: item.descProduct,
          price: item.price,
          stockMax: item.stockMax,
          totalQty: item.totalQty,
          createdBy: userId,
        }));

        await tx.orderItem.createMany({ data: orderItems });
        // 3. Kurangi stok di tabel Product
        for (const item of keranjang) {
          await tx.product.update({
            where: { id: item.idProduct },
            data: {
              stock: {
                decrement: item.totalQty,
              },
              updatedBy: userId,
            },
          });
        }
        return { success: true, invoice };
      });
    } catch (error) {
      console.error('🔥 Error saat create order:', error);
      throw new InternalServerErrorException('Gagal membuat pesanan');
    }
  }
  async getAllTransaction(userId: number) {
    let orders: any[] = [];
    const userInfo = this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    const role = (await userInfo).role;
    try {
      if (role == 'Mitra') {
        orders = await this.prisma.order.findMany({
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' }, // ⬅️ Ini juga
          include: {
            OrderItem: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    desc: true,
                    price: true,
                    stock: true,
                    creator: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                      },
                    },
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                photo: true,
              },
            },
          },
        });
      } else if (role == 'Konsumen') {
        orders = await this.prisma.order.findMany({
          where: { userId, deletedAt: null },
          orderBy: { createdAt: 'desc' }, // ⬅️ Ini juga
          include: {
            OrderItem: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    desc: true,
                    price: true,
                    stock: true,
                    creator: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                      },
                    },
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                photo: true,
              },
            },
          },
        });
      }
      orders.map((order) => ({
        ...order,
        OrderItem: order.OrderItem.map((item: { product: any }) => ({
          ...item,
          product: {
            ...item.product,
            stock: undefined, // Hapus field stock dari hasil
          },
        })),
      }));

      return orders;
    } catch (error) {
      console.error('🔥 Error saat mendapatkan semua order:', error);
      throw new InternalServerErrorException('Gagal mendapatkan semua order');
    }
  }
}
