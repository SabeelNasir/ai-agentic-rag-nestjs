import { Controller, Get, Body, Put, Post, Param } from "@nestjs/common";
import { ModelPricingService } from "./model-pricing.service";

@Controller("api/model-pricing")
export class ModelPricingController {
  constructor(private readonly pricingService: ModelPricingService) {}

  @Get()
  getAll() {
    return this.pricingService.getAllPricing();
  }

  @Post("refresh")
  refresh() {
    return this.pricingService.seedDefaults();
  }

  @Put(":model")
  update(@Param("model") model: string, @Body() body: { input_per_1m: number; output_per_1m: number }) {
    return this.pricingService.updatePricing(model, body.input_per_1m, body.output_per_1m);
  }
}
