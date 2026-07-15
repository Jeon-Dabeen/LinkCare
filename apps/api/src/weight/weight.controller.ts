import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WeightService } from './weight.service';
import { CreateWeightDto } from './dto/create-weight.dto';


@Controller('weight')
export class WeightController {
  constructor(private readonly weightService: WeightService) {}

  @Post()
  create(@Body() createWeightDto: CreateWeightDto) {
    return this.weightService.createWeight(createWeightDto);
  }

  @Get()
  findAll() {
    return this.weightService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.weightService.findOne(+id);
  }



  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.weightService.remove(+id);
  }
}
