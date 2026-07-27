import { PartialType } from '@nestjs/swagger';
import { CreateDailyShieldDto } from './create-daily-shield.dto';

export class UpdateDailyShieldDto extends PartialType(CreateDailyShieldDto) {}
