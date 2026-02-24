import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ApplicationEntity } from "src/database/entities/application.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(ApplicationEntity)
    private readonly repo: Repository<ApplicationEntity>,
  ) {}

  async findByName(name: string) {
    return this.repo.findOne({ where: { name } });
  }

  async getApplicationId(name: string): Promise<number | undefined> {
    if (!name) return undefined;
    const app = await this.findByName(name);
    return app?.id;
  }

  findAll() {
    return this.repo.find({ relations: ["user", "agent"], order: { created_at: "DESC" } });
  }

  create(data: { name: string; description?: string; user_id?: number; agent_id?: number }) {
    return this.repo.save(data);
  }

  async update(id: number, data: Partial<ApplicationEntity>) {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }

  /**
   * Generate an API key for an application.
   * Returns the raw key (shown only once). The hash is stored in DB.
   */
  async generateApiKey(appId: number): Promise<{ apiKey: string }> {
    const rawKey = `rak_${crypto.randomBytes(32).toString("hex")}`;
    const hash = await bcrypt.hash(rawKey, 10);
    await this.repo.update(appId, { api_key_hash: hash });
    return { apiKey: rawKey };
  }

  /**
   * Validate an API key: find the application whose stored hash matches the raw key.
   * Returns the application with its associated user, or null.
   */
  async validateApiKey(rawKey: string): Promise<ApplicationEntity | null> {
    if (!rawKey) return null;
    const apps = await this.repo.find({
      where: { is_active: true },
      relations: ["user"],
    });
    for (const app of apps) {
      if (app.api_key_hash && (await bcrypt.compare(rawKey, app.api_key_hash))) {
        return app;
      }
    }
    return null;
  }

  async findById(id: number) {
    return this.repo.findOne({ where: { id }, relations: ["user", "agent"] });
  }
}
