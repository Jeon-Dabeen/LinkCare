import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { IntegrationsModule } from "./integrations/integrations.module";
import { CheckupModule } from "./checkup/checkup.module";
import { WeightModule } from "./weight/weight.module";
import { DailyShieldModule } from "./daily-shield/daily-shield.module";
import { MealModule } from "./meal/meal.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { GreetModule } from "./greet/greet.module";
import { BloodGlucoseModule } from "./blood-glucose/blood-glucose.module";
import { ProfileModule } from "./profile/profile.module";

@Module({
  imports: [
    PrismaModule,
    CheckupModule,
    IntegrationsModule,
    WeightModule,
    DailyShieldModule,
    MealModule,
    AuthModule,
    UserModule,
    GreetModule,
    BloodGlucoseModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
