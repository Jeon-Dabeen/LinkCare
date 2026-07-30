import { PartialType } from '@nestjs/swagger';
import { CreateBloodGlucoseDto } from './create-blood-glucose.dto';

export class UpdateBloodGlucoseDto extends PartialType(CreateBloodGlucoseDto) {}
