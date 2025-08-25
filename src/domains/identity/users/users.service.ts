import { Prisma } from '@prisma/client';
import { PrismaService } from '@core/prisma';
import { ConflictException, Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(username: string) {
    return this.prisma.users.findUnique({
      where: { username },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const { username, email, password } = createUserDto;

    const saltRounds = 10;
    const pwdHash = await bcrypt.hash(password, saltRounds);

    try {
      await this.prisma.users.create({
        data: {
          username,
          email,
          pwdHash,
        },
      });
      return { message: 'user_created' };
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        const target = e.meta?.target as string[];
        if (target.includes('username')) {
          throw new ConflictException('username_exists');
        }
        if (target.includes('email')) {
          throw new ConflictException('email_exists');
        }
      }
      throw e;
    }
  }
}
