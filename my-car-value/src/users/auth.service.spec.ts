import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { BadRequestException } from '@nestjs/common';

const createFakeUserService: () => Partial<UsersService> = () => ({
  findByEmail: () => Promise.resolve([]),
  createUser: (email: string, password: string) =>
    Promise.resolve({ id: 1, email, password } as User),
});

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUserService = createFakeUserService();
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUserService },
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

    expect(user).toEqual({ id: 1, email, password: expect.any(String) });
    expect(user.password).not.toEqual(password);
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('should throw an error if email already taken when signup', async () => {
    fakeUserService.findByEmail = () => Promise.resolve([{ id: 1 } as User]);

    await expect(service.signUp('', '')).rejects.toThrow(
      new BadRequestException('Email in use'),
    );
  });
});
