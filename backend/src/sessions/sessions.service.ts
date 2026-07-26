import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createSession(userId: string, refreshToken: string, expiresAt: Date) {
    return this.prisma.session.create({
      data: {
        userId,
        refreshToken,
        expiresAt,
      },
    });
  }

  async findSessionByToken(refreshToken: string) {
    return this.prisma.session.findUnique({
      where: { refreshToken },
      include: {
        user: {
          include: {
            role: true,
            company: true,
          },
        },
      },
    });
  }

  async revokeSession(refreshToken: string) {
    try {
      return await this.prisma.session.delete({
        where: { refreshToken },
      });
    } catch (e) {
      return null;
    }
  }

  async revokeAllUserSessions(userId: string) {
    return this.prisma.session.deleteMany({
      where: { userId },
    });
  }
}
