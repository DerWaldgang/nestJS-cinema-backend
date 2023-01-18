import { UserModel } from 'src/user/user.model';
import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<{user: UserModel}>()
        const user = request.user

        if(!user?.isAdmin) throw new ForbiddenException('You have no admin rigths!')

        return user.isAdmin
    }
}