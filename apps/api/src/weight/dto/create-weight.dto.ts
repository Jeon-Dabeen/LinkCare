import { IsNumber, IsOptional, Matches, Max, Min } from "class-validator";

export class CreateWeightDto {
  @Min(0)
  @Max(300)
  @IsNumber({ maxDecimalPlaces: 2 })
  weight: number;

  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  weightDate: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Max(250)
  height?: number;

  @IsOptional()
  @Min(0)
  @Max(250)
  @IsNumber({maxDecimalPlaces:2})
  goalWeight?: number;
}
