import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { scrypt, verify } from '../utils/crypto';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signUp(email: string, password: string) {
    const users = await this.userService.findByEmail(email);

    if (users.length) throw new BadRequestException('Email in use');

    const hashedPassword = await scrypt(password);

    return this.userService.createUser(email, hashedPassword);
  }

  async signIn(email: string, password: string) {
    const [user] = await this.userService.findByEmail(email);

    if (!user) throw new BadRequestException('Incorrect email or password');

    const passwordValid = await verify(user.password, password);

    if (!passwordValid)
      throw new BadRequestException('Incorrect email or password');

    return user;
  }
}
