import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ModelPricing } from "../../database/entities/model-pricing.entity";
import { DEFAULT_MODEL_PRICING } from "./default-model-pricing";

@Injectable()
export class ModelPricingService implements OnModuleInit {
  private readonly logger = new Logger(ModelPricingService.name);

  constructor(
    @InjectRepository(ModelPricing)
    private readonly repo: Repository<ModelPricing>,
  ) {}

  async onModuleInit() {
    await this.seedDefaults();
  }

  async getPricing(model: string): Promise<{ input: number; output: number } | null> {
    const record = await this.repo.findOne({ where: { model: model.toLowerCase() } });
    if (record) {
      // Return converted to per-1K tokens
      return {
        input: parseFloat(record.input_per_1m.toString()) / 1000,
        output: parseFloat(record.output_per_1m.toString()) / 1000,
      };
    }
    return null;
  }

  async getAllPricing() {
    return this.repo.find();
  }

  async updatePricing(model: string, inputPer1m: number, outputPer1m: number) {
    const entry = this.repo.create({
      model: model.toLowerCase(),
      input_per_1m: inputPer1m,
      output_per_1m: outputPer1m,
    });
    return this.repo.save(entry);
  }

  async seedDefaults() {
    this.logger.log("Seeding default model pricing...");
    for (const [model, rates] of Object.entries(DEFAULT_MODEL_PRICING)) {
      await this.repo.upsert(
        {
          model: model.toLowerCase(),
          input_per_1m: rates.input,
          output_per_1m: rates.output,
        },
        ["model"],
      );
    }
    this.logger.log("Default pricing seeded successfully.");
  }
}
