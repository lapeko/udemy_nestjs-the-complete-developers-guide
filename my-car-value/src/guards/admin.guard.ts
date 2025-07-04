import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRole } from '../users/users.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.session?.userId) return false;

    if (!request.currentUser)
      request.currentUser = await this.usersService.findOne(
        request.session.userId,
      );

    return request.currentUser?.role === UserRole.ADMIN;
  }
}
