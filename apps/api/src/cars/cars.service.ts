import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CarsService {
  constructor(private readonly prisma: PrismaService) {}

  listBrands() {
    return this.prisma.brand.findMany({ orderBy: { name: 'asc' } });
  }

  async listModels(brandSlug: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { slug: brandSlug },
    });
    if (!brand) throw new NotFoundException(`Brand "${brandSlug}" not found`);

    return this.prisma.carModel.findMany({
      where: { brandId: brand.id },
      orderBy: { name: 'asc' },
    });
  }

  async listGenerations(brandSlug: string, modelSlug: string) {
    const model = await this.prisma.carModel.findFirst({
      where: { slug: modelSlug, brand: { slug: brandSlug } },
    });
    if (!model) {
      throw new NotFoundException(
        `Model "${brandSlug}/${modelSlug}" not found`,
      );
    }

    return this.prisma.generation.findMany({
      where: { carModelId: model.id },
      orderBy: { yearStart: 'asc' },
    });
  }

  async getGeneration(id: number) {
    const generation = await this.prisma.generation.findUnique({
      where: { id },
      include: { carModel: { include: { brand: true } } },
    });
    if (!generation) throw new NotFoundException(`Generation ${id} not found`);
    return generation;
  }
}
