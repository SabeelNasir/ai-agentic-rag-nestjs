import { Entity, Column, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity("model_pricing")
export class ModelPricing {
  @PrimaryColumn()
  model: string;

  @Column({ type: "decimal", precision: 12, scale: 8, default: 0 })
  input_per_1m: number;

  @Column({ type: "decimal", precision: 12, scale: 8, default: 0 })
  output_per_1m: number;

  @UpdateDateColumn()
  updated_at: Date;
}
