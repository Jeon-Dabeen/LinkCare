import { Injectable } from '@nestjs/common';
import { CreateWeightDto } from './dto/create-weight.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class WeightService {
  constructor(private readonly prisma:PrismaService){}
  
  async createWeight(createWeightDto: CreateWeightDto) {
    const {height,weight}=createWeightDto;
    const heightMeter = height /100;
    const bmi = Math.round( (weight / (heightMeter * heightMeter)) * 10) / 10;
    const weightDate = new Date();
    
    return this.prisma.weight.create({
      data:{
        height,
        weight,
        bmi,
        weightDate,
      }
    })




  }

  findAll() {
    return `This action returns all weight`;
  }

  findOne(id: number) {
    return `This action returns a #${id} weight`;
  }


  remove(id: number) {
    return `This action removes a #${id} weight`;
  }
}
