import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { UsersService } from './users.service';

const script = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signUp(email: string, password: string) {
    const users = await this.userService.findByEmail(email);

    if (users.length) throw new BadRequestException('Email in use');

    const salt = randomBytes(8).toString('hex');

    const hash = (await script(password, salt, 32)) as Buffer;

    const result = `${salt}.${hash.toString('hex')}`;

    const user = await this.userService.createUser(email, result);

    return user;
  }

  async signIn(email: string, password: string) {
    const [user] = await this.userService.findByEmail(email);

    if (!user) throw new BadRequestException('Incorrect email or password');

    const [salt, dbHash] = user.password.split('.');

    const hash = (await script(password, salt, 32)) as Buffer;

    if (hash.toString('hex') !== dbHash)
      throw new BadRequestException('Incorrect email or password');

    return user;
  }
}
