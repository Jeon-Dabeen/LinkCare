import { IsNumber, IsOptional, Max, Min } from "class-validator";

export class UpdateWeightProfileDto {

    @IsOptional()
    @IsNumber({maxDecimalPlaces:1})
    @Min(0)
    @Max(250)
    height?:number;

    @IsOptional()
    @Min(0)
    @Max(250)
    @IsNumber({maxDecimalPlaces:2})
    goalWeight?:number;
}