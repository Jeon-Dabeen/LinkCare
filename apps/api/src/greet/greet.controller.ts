import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GreetService } from './greet.service';
import { CreateGreetDto } from './dto/create-greet.dto';
import { UpdateGreetDto } from './dto/update-greet.dto'

@Controller('greet')
export class GreetController {
  constructor(private readonly greetService: GreetService) {}

  @Post()
  create(@Body() createGreetDto: CreateGreetDto) {
    return this.greetService.create(createGreetDto);
  }

  @Get()
  findAll() {
    return this.greetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.greetService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGreetDto: UpdateGreetDto) {
    return this.greetService.update(+id, updateGreetDto);
  }
}
