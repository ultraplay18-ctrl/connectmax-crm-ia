import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { EncryptionService } from '../crypto/encryption.service';
import { CreateSecretDto } from '../dto/create-secret.dto';

@Injectable()
export class SecretsManagerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async saveSecret(companyId: string, dto: CreateSecretDto, userId?: string) {
    const encryptedValue = this.encryptionService.encrypt(dto.value);
    const maskedValue = this.encryptionService.maskToken(dto.value);

    const secret = await this.prisma.companySecret.upsert({
      where: { companyId_keyName: { companyId, keyName: dto.keyName } },
      create: {
        companyId,
        keyName: dto.keyName,
        encryptedValue,
        maskedValue,
        category: dto.category || 'PROVIDER',
        createdBy: userId || null,
        updatedBy: userId || null,
      },
      update: {
        encryptedValue,
        maskedValue,
        category: dto.category || 'PROVIDER',
        updatedBy: userId || null,
      },
    });

    // Auditoria
    await this.prisma.secretAuditLog.create({
      data: {
        companyId,
        action: 'UPSERT',
        keyName: dto.keyName,
        actorUser: userId || 'Sistema',
        details: `Credencial ${dto.keyName} criptografada e salva com sucesso.`,
      },
    });

    return {
      id: secret.id,
      keyName: secret.keyName,
      maskedValue: secret.maskedValue,
      category: secret.category,
      updatedAt: secret.updatedAt,
    };
  }

  async getSecrets(companyId: string) {
    const secrets = await this.prisma.companySecret.findMany({
      where: { companyId },
      orderBy: { updatedAt: 'desc' },
    });

    // Retorna apenas valores mascarados
    return secrets.map((s) => ({
      id: s.id,
      keyName: s.keyName,
      maskedValue: s.maskedValue,
      category: s.category,
      updatedAt: s.updatedAt,
    }));
  }

  async deleteSecret(companyId: string, keyName: string, userId?: string) {
    await this.prisma.companySecret.deleteMany({
      where: { companyId, keyName },
    });

    await this.prisma.secretAuditLog.create({
      data: {
        companyId,
        action: 'DELETE',
        keyName,
        actorUser: userId || 'Sistema',
        details: `Credencial ${keyName} removida do cofre.`,
      },
    });

    return { success: true, message: `Credencial ${keyName} removida com sucesso.` };
  }

  async getAuditLogs(companyId: string) {
    return this.prisma.secretAuditLog.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
