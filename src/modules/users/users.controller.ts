import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map(({ password, ...rest }) => rest);
  }

  @Post()
  async create(@Body() body: { username: string; email: string; password: string; name?: string }) {
    const user = await this.usersService.create(body);
    const { password, ...result } = user;
    return result;
  }

  @Patch(":id")
  async update(@Param("id") id: number, @Body() body: any) {
    const user = await this.usersService.update(id, body);
    if (!user) return { message: "User not found" };
    const { password, ...result } = user;
    return result;
  }

  @Delete(":id")
  async delete(@Param("id") id: number) {
    await this.usersService.delete(id);
    return { message: "User deleted" };
  }
}
