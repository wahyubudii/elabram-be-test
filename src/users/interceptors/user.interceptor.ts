import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { convertToUnixTimestamp } from 'src/utils/convert-to-unix';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(private readonly prismaService: PrismaService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();

    const token = request?.headers?.authorization?.split('Bearer ')[1];

    if (token) {
      const user = await this.prismaService.user.findFirst({
        where: { token },
      });
      if (!user) throw new HttpException('Invalid Token!', 400);

      const tokenData = {
        id: user.id,
        name: user.fullname,
        email: user.email,
        iat: convertToUnixTimestamp(user.created_at),
        exp: null,
      };

      request.user = tokenData;
    }

    return next.handle();
  }
}
