import { IsNumber,IsNotEmpty} from "class-validator";


export class CreateWeightDto {
  @IsNumber({ maxDecimalPlaces: 1 })
  height: number;

  @IsNumber({ maxDecimalPlaces: 1 })
  weight: number;
}