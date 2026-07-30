import { Injectable } from '@nestjs/common';
import { CreateGreetDto } from './dto/create-greet.dto';
import { UpdateGreetDto } from './dto/update-greet.dto';

@Injectable()
export class GreetService {
  create(createGreetDto: CreateGreetDto) {
    return 'This action adds a new greet';
  }

  findAll() {
    return `This action returns all greet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} greet`;
  }

  update(id: number, updateGreetDto: UpdateGreetDto) {
    return `This action updates a #${id} greet`;
  }
}
