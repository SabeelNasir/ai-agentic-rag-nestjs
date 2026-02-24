import { Module, Global } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ModelPricing } from "../../database/entities/model-pricing.entity";
import { ModelPricingService } from "./model-pricing.service";
import { ModelPricingController } from "./model-pricing.controller";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ModelPricing])],
  providers: [ModelPricingService],
  controllers: [ModelPricingController],
  exports: [ModelPricingService],
})
export class ModelPricingModule {}
