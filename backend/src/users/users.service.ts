import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  async create(companyId: string, dto: CreateUserDto, actorUserId?: string) {
    await this.subscriptionsService.checkUserLimit(companyId);

    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Já existe um usuário cadastrado com este e-mail.');
    }

    let roleId = dto.roleId;

    if (!roleId && dto.roleName) {
      const roleObj = await this.prisma.role.findUnique({ where: { name: dto.roleName } });
      if (roleObj) roleId = roleObj.id;
    }

    if (!roleId) {
      const defaultRole = await this.prisma.role.findUnique({ where: { name: 'EMPLOYEE' } });
      roleId = defaultRole.id;
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        companyId,
        roleId,
        name: dto.name,
        email: dto.email,
        password: passwordHash,
        status: 'ACTIVE',
      },
      include: {
        role: true,
        company: { select: { id: true, name: true } },
      },
    });

    await this.auditLogsService.log({
      companyId,
      userId: actorUserId,
      action: 'USER_CREATE',
      entity: 'User',
      entityId: user.id,
      payload: { name: user.name, email: user.email, role: user.role.name },
    });

    const { password, ...result } = user;
    return result;
  }

  async findAllByCompany(companyId: string, isSuperAdmin = false) {
    const whereCondition = isSuperAdmin && !companyId ? {} : { companyId };

    const users = await this.prisma.user.findMany({
      where: whereCondition,
      include: {
        role: true,
        company: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return users.map(({ password, ...rest }) => rest);
  }

  async findOne(id: string, companyId?: string, isSuperAdmin = false) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        company: { 
          include: { settings: true }
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (!isSuperAdmin && companyId && user.companyId !== companyId) {
      throw new ForbiddenException('Acesso negado: Usuário pertence a outra empresa.');
    }

    const { password, ...result } = user;
    return {
      ...result,
      settings: user.company?.settings || null,
    };
  }

  async update(id: string, dto: UpdateUserDto, companyId?: string, actorUserId?: string, isSuperAdmin = false) {
    const existing = await this.findOne(id, companyId, isSuperAdmin);

    const dataToUpdate: any = {};
    if (dto.name) dataToUpdate.name = dto.name;
    if (dto.email) dataToUpdate.email = dto.email;
    if (dto.roleId) dataToUpdate.roleId = dto.roleId;
    if (dto.status) dataToUpdate.status = dto.status;

    if (dto.password) {
      dataToUpdate.password = await bcrypt.hash(dto.password, 10);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
      include: {
        role: true,
        company: { select: { id: true, name: true } },
      },
    });

    await this.auditLogsService.log({
      companyId: updated.companyId,
      userId: actorUserId,
      action: 'USER_UPDATE',
      entity: 'User',
      entityId: updated.id,
      payload: { fieldsChanged: Object.keys(dataToUpdate) },
    });

    const { password, ...result } = updated;
    return result;
  }
}
