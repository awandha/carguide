import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const honda = await prisma.brand.upsert({
    where: { slug: 'honda' },
    update: {},
    create: { name: 'Honda', slug: 'honda' },
  });

  const odyssey = await prisma.carModel.upsert({
    where: { brandId_slug: { brandId: honda.id, slug: 'odyssey' } },
    update: {},
    create: { name: 'Odyssey', slug: 'odyssey', brandId: honda.id },
  });

  const generations = [
    { code: 'RA6', slug: 'ra6', yearStart: 1999, yearEnd: 2003 },
    { code: 'RB1', slug: 'rb1', yearStart: 2003, yearEnd: 2008 },
  ];

  for (const g of generations) {
    await prisma.generation.upsert({
      where: { carModelId_slug: { carModelId: odyssey.id, slug: g.slug } },
      update: {},
      create: { ...g, carModelId: odyssey.id },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });