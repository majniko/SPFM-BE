import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../../types/jwt-payload';

type JwtPayloadKey = keyof JwtPayload;

export const User = createParamDecorator(
  (data: JwtPayloadKey | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    return data ? user?.[data] : user;
  },
);
