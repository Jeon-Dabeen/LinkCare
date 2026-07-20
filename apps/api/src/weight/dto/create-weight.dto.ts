import { IsNumber, IsOptional } from "class-validator";



export class CreateWeightDto {


@IsNumber({maxDecimalPlaces:2})
weight:number;


@IsNumber({maxDecimalPlaces:1})
@IsOptional()
height?:number;


@IsOptional()
@IsNumber({
  maxDecimalPlaces:2
})
goalWeight?:number;

}