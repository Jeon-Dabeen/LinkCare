import { mealtiming, mealtype } from "@prisma/client";
import { IsEnum, IsInt, Matches, Min } from "class-validator";

export class CreateBloodGlucoseDto {
  @IsInt()
  @Min(0)
  glucose: number;

  //아침,점심,저녁
  @IsEnum(mealtype)
  mealType: mealtype;

  //식전,식후
  @IsEnum(mealtiming)
  mealTiming: mealtiming;

  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  bgDate: string;
}

