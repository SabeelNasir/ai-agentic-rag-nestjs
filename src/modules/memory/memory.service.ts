import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Memory } from "src/database/entities/memory.entity";
import { Repository } from "typeorm";

// Memory service for the chat_memory entity to persist chat memory session-wise in database

@Injectable()
export class MemoryService {
  constructor(@InjectRepository(Memory) private readonly repo: Repository<Memory>) {}

  getRepo() {
    return this.repo;
  }
}
