import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { convertToJakartaTime } from 'src/utils/convert-time';
import {
  generateHashPassword,
  generateHashToken,
} from 'src/utils/generate-hash';

interface SignupParams {
  email: string;
  password: string;
  fullname: string;
}

interface SigninParams {
  email: string;
  password: string;
}

interface UpdateProfileParams {
  fullname?: string;
  email?: string;
}

interface UpdatePasswordParams {
  oldPassword: string;
  newPassword: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signup({ email, password, fullname }: SignupParams) {
    const userExists = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (userExists) throw new ConflictException('User already exists!');

    const newUser = await this.prismaService.user.create({
      data: {
        email,
        password: generateHashPassword(password),
        fullname,
      },
    });

    const response = {
      status: 1,
      message: 'User successfully created!',
      data: {
        id: newUser.id,
        fullname: newUser.fullname,
        email: newUser.email,
        createdAt: newUser.created_at,
        updatedAt: newUser.updated_at,
      },
    };

    return response;
  }

  async signin({ email, password }: SigninParams) {
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user) throw new UnauthorizedException();

    const hashedPassword = generateHashPassword(password);

    const isPasswordValid = user.password === hashedPassword;
    if (!isPasswordValid) throw new HttpException('Invalid Password!', 400);

    const tokenData = {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
    };

    const generateToken = await this.prismaService.user.update({
      where: { email },
      data: { token: generateHashToken(tokenData) },
    });

    const response = {
      status: 1,
      message: 'Login successfully!',
      data: {
        id: user.id,
        token: generateToken.token,
      },
    };

    return response;
  }

  async profile(userId: number) {
    const user = await this.prismaService.user.findFirst({
      where: { id: userId },
      include: { companies: true },
    });

    const response = {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      password: user.password,
      token: user.token,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      company: user.companies,
    };

    return {
      status: 1,
      message: null,
      data: response,
    };
  }

  async signout(userId: number) {
    await this.prismaService.user.update({
      where: { id: userId },
      data: { token: '' },
    });

    const response = {
      status: 1,
      message: 'Logout successfully!',
      data: null,
    };

    return response;
  }

  async updateProfile(
    userId: number,
    { fullname, email }: UpdateProfileParams,
  ) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (email && user.email !== email) {
      const userExist = await this.prismaService.user.findUnique({
        where: { email },
      });
      if (userExist) throw new HttpException('Email already used!', 400);
    }

    const updateUser = await this.prismaService.user.update({
      where: { id: userId },
      data: {
        fullname,
        email,
        updated_at: convertToJakartaTime(new Date()),
      },
    });

    const response = {
      status: 1,
      message: 'Update profile successfully!',
      data: {
        id: updateUser.id,
        fullname: updateUser.fullname,
        email: updateUser.email,
        createdAt: updateUser.created_at,
        updatedAt: updateUser.updated_at,
      },
    };

    return response;
  }

  async updatePassword(
    userId: number,
    { oldPassword, newPassword }: UpdatePasswordParams,
  ) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    const isOldPasswordValid =
      user.password === generateHashPassword(oldPassword);
    if (!isOldPasswordValid)
      throw new HttpException('Old password is not correct!', 400);

    const hashedNewPassword = generateHashPassword(newPassword);
    const isNewPasswordValid = user.password === hashedNewPassword;
    if (isNewPasswordValid)
      throw new HttpException('New password can not be same!', 400);

    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        password: hashedNewPassword,
        updated_at: convertToJakartaTime(new Date()),
      },
    });

    const response = {
      status: 1,
      message: 'Update password successfully!',
      data: null,
    };

    return response;
  }
}
