import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { FoodCategory } from "./food-category.entity";

@Entity({ name: "food_product" })
export class FoodProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "numeric" })
  price: number;

  @ManyToOne(() => FoodCategory, (cat) => cat.id)
  @JoinColumn({ name: "category_id", foreignKeyConstraintName: "fk_food_product_category" })
  category: FoodCategory;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
