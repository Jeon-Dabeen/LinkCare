import { IsDateString, IsNumber, IsOptional, Matches, Max, Min } from "class-validator";

export class CreateWeightDto {
  @Min(0)
  @Max(300)
  @IsNumber({ maxDecimalPlaces: 2 })
  weight: number;

  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  weightDate: string;

  @IsOptional()
  @Min(0)
  @Max(250)
  @IsNumber({maxDecimalPlaces:2})
  goalWeight?: number;
}
