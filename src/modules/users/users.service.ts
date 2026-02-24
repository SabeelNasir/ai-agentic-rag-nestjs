import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "../../database/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ order: { created_at: "DESC" } });
  }

  async create(userDto: any): Promise<User> {
    if (userDto.password) {
      userDto.password = await bcrypt.hash(userDto.password, 10);
    }
    return this.usersRepository.save(userDto);
  }

  async update(id: number, updateDto: any): Promise<User | null> {
    // Never allow password update through this method
    delete updateDto.password;
    await this.usersRepository.update(id, updateDto);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
}
