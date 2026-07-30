import { PartialType } from '@nestjs/swagger';
import { CreateGreetDto } from './create-greet.dto';

export class UpdateGreetDto extends PartialType(CreateGreetDto) {}
