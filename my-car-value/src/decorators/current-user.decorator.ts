import {
  ExecutionContext,
  createParamDecorator,
  Injectable,
  PipeTransform,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';

const CurrentRequest = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest();
  },
);

@Injectable()
class CurrentUserPipe implements PipeTransform<number, Promise<User>> {
  constructor(private readonly usersService: UsersService) {}

  async transform(request: any): Promise<User> {
    if (request.currentUser) return request.currentUser;
    if (!request.session?.userId) throw new UnauthorizedException();
    const user = await this.usersService.findOne(request.session.userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}

export const CurrentUser = () => CurrentRequest(CurrentUserPipe);
