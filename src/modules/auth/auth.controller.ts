import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() body: any) {
    const { email, username, password, name } = body;
    if (!username || !password) throw new BadRequestException('username and password required');
    const existing = await this.usersService.findByUsername(username) || (email ? await this.usersService.findByEmail(email) : null);
    if (existing) throw new BadRequestException('user with given username/email already exists');
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({ email, username, password: hashed, name });
    return { id: user.id, username: user.username, email: user.email, name: user.name };
  }

  @Post('login')
  async login(@Body() body: any) {
    const { username, password } = body;
    if (!username || !password) throw new BadRequestException('username and password required');
    const user = await this.usersService.findByUsername(username);
    if (!user) throw new BadRequestException('invalid credentials');
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new BadRequestException('invalid credentials');
    return this.authService.login(user);
  }
}