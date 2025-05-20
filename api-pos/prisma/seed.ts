import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: 'Nasi Goreng',
        price: 5000,
        stock: 100,
        desc: '',
        createdBy: 4,
      },
      {
        name: 'Nasi Uduk',
        price: 8000,
        stock: 50,
        desc: '',
        createdBy: 4,
      },
      {
        name: 'Cap Cay',
        price: 16000,
        stock: 10,
        desc: '',
        createdBy: 4,
      },
      {
        name: 'Ayam Penyet',
        price: 20000,
        stock: 20,
        desc: '',
        createdBy: 4,
      },
      {
        name: 'Soto Ayam',
        price: 15000,
        stock: 30,
        desc: '',
        createdBy: 4,
      },
      {
        name: 'Mie Goreng',
        price: 12000,
        stock: 40,
        desc: '',
        createdBy: 4,
      },
      {
        name: 'Bakso',
        price: 10000,
        stock: 60,
        desc: '',
        createdBy: 4,
      },
      {
        name: 'Tahu Tempe',
        price: 5000,
        stock: 70,
        desc: '',
        createdBy: 4,
      },
      {
        name: 'Kerupuk',
        price: 2000,
        stock: 80,
        desc: '',
        createdBy: 4,
      },
      {
        name: 'Es Teh',
        price: 3000,
        stock: 90,
        desc: '',
        createdBy: 4,
      },
      {
        name: 'Es Jeruk',
        price: 4000,
        stock: 110,
        desc: '',
        createdBy: 4,
      },
      {
        name: 'Kopi',
        price: 6000,
        stock: 120,
        desc: '',
        createdBy: 4,
      },
    ],
  });

  console.log('✅ Seeding selesai!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
