import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { BadRequestException } from '@nestjs/common';
import { scrypt, verify } from '../utils/crypto';

const createUserServiceMock: () => Partial<UsersService> = () => ({
  findByEmail: () => Promise.resolve([]),
  createUser: (email: string, password: string) =>
    Promise.resolve({ id: 1, email, password } as User),
});

describe('AuthService', () => {
  let service: AuthService;
  let userServiceMock: Partial<UsersService>;

  beforeEach(async () => {
    userServiceMock = createUserServiceMock();
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: userServiceMock },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('should exist', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    const email = 'email@mail.com';
    const password = '1234';

    const user = await service.signUp(email, password);
    const passwordValid = await verify(user.password, password);

    expect(user).toEqual({ id: 1, email, password: expect.any(String) });
    expect(user.password).not.toEqual(password);
    expect(passwordValid).toBe(true);
  });

  it('should throw an error if email already taken when signup', async () => {
    userServiceMock.findByEmail = () => Promise.resolve([{ id: 1 } as User]);

    await expect(service.signUp('', '')).rejects.toThrow(
      new BadRequestException('Email in use'),
    );
  });

  it('should throw an error if email not found when signin', async () => {
    await expect(service.signIn('', '')).rejects.toThrow(
      new BadRequestException('Incorrect email or password'),
    );
  });

  it('should throw an error if password is wrong when signing in', async () => {
    const passwordMock = '1234';
    const hashedPassword = await scrypt(passwordMock);

    userServiceMock.findByEmail = () =>
      Promise.resolve([{ id: 1, password: hashedPassword } as User]);

    await expect(service.signIn('', 'wrong')).rejects.toThrow(
      new BadRequestException('Incorrect email or password'),
    );
  });

  it('should return a user on success signing in', async () => {
    const passwordMock = '1234';
    const mockedUser = {
      id: 1,
      email: 'test@mail.com',
      password: await scrypt(passwordMock),
    } as User;
    userServiceMock.findByEmail = () => Promise.resolve([mockedUser]);

    const user = await service.signIn('', passwordMock);

    expect(user).toBe(mockedUser);
  });
});
