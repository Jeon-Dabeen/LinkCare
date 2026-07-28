import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { IntegrationsModule } from "./integrations/integrations.module";
import { CheckupModule } from "./checkup/checkup.module";
import { WeightModule } from "./weight/weight.module";
import { MealModule } from './meal/meal.module';

@Module({
  imports: [PrismaModule, CheckupModule, IntegrationsModule, WeightModule, MealModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
 