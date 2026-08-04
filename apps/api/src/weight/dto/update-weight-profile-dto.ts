import { IsNumber, IsOptional, Max, Min } from "class-validator";

export class UpdateWeightProfileDto {
    @IsOptional()
    @Min(0)
    @Max(250)
    @IsNumber({maxDecimalPlaces:2})
    goalWeight?:number;
}