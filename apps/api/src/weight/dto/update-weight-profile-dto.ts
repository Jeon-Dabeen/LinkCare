import { IsNumber, IsOptional } from "class-validator";

export class UpdateWeightProfileDto {

    @IsOptional()
    @IsNumber({maxDecimalPlaces:1})
    height?:number;

    @IsOptional()
    @IsNumber({maxDecimalPlaces:2})
    goalWeight?:number;
}