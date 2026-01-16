import { Injectable } from "@nestjs/common";
import {
  DeepPartial,
  FindOptionsWhere,
  Repository,
  ObjectLiteral,
  FindManyOptions,
  FindOneOptions,
  UpdateResult,
  DeleteResult,
} from "typeorm";

@Injectable()
export abstract class BaseRepoService<T extends ObjectLiteral> {
  private _repo: Repository<T>;

  constructor(repo: Repository<T>) {
    this._repo = repo;
  }

  create(payload: DeepPartial<T>): T {
    return this._repo.create(payload);
  }

  save(payload: DeepPartial<T>): Promise<T> {
    return this._repo.save(payload);
  }

  update(criteria: FindOptionsWhere<T>, payload: DeepPartial<T>): Promise<UpdateResult> {
    return this._repo.update(criteria, payload as any);
  }

  delete(criteria: FindOptionsWhere<T>): Promise<DeleteResult> {
    return this._repo.delete(criteria);
  }

  findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this._repo.find(options);
  }

  findOne(condition: FindOptionsWhere<T> | FindOneOptions<T>): Promise<T | null> {
    if (this._isFindOneOptions(condition)) {
      return this._repo.findOne(condition);
    }
    return this._repo.findOne({ where: condition });
  }

  remove(entity: T): Promise<T> {
    return this._repo.remove(entity);
  }

  private _isFindOneOptions(obj: any): obj is FindOneOptions<T> {
    return typeof obj === "object" && ("where" in obj || "select" in obj || "relations" in obj || "order" in obj);
  }
}
