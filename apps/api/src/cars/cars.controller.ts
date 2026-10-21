import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CarsService } from './cars.service';

@Controller('cars')
export class CarsController {
  constructor(private readonly cars: CarsService) {}

  @Get('brands')
  brands() {
    return this.cars.listBrands();
  }

  @Get('brands/:brandSlug/models')
  models(@Param('brandSlug') brandSlug: string) {
    return this.cars.listModels(brandSlug);
  }

  @Get('brands/:brandSlug/models/:modelSlug/generations')
  generations(
    @Param('brandSlug') brandSlug: string,
    @Param('modelSlug') modelSlug: string,
  ) {
    return this.cars.listGenerations(brandSlug, modelSlug);
  }

  @Get('generations/:id')
  generation(@Param('id', ParseIntPipe) id: number) {
    return this.cars.getGeneration(id);
  }
}
