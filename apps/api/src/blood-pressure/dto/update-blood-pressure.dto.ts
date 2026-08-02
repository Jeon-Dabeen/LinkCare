import { IsInt, Min } from "class-validator";

export class UpdateBloodPressurePulseDto {
  @IsInt()
  @Min(1)
  pulse: number;
}
