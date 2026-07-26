import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AuditLogsService } from '../../audit-logs/audit-logs.service';
import { CreateAgentDto } from '../dto/create-agent.dto';
import { UpdateAgentDto } from '../dto/update-agent.dto';

@Injectable()
export class AiAgentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async create(companyId: string, dto: CreateAgentDto, actorUserId?: string) {
    const agent = await this.prisma.aiAgent.create({
      data: {
        companyId,
        name: dto.name,
        avatar: dto.avatar || null,
        description: dto.description || null,
        category: dto.category || 'Personalizado',
        responsibleId: dto.responsibleId || actorUserId || null,
        modelName: dto.modelName || 'gpt-4o',
        provider: dto.provider || 'OpenAI',
        status: dto.status || 'ACTIVE',
        personality: dto.personality || 'PROFESSIONAL',
        toneOfVoice: dto.toneOfVoice || null,
        emoji: dto.emoji || '🤖',
        temperature: dto.temperature !== undefined ? dto.temperature : 0.7,
        maxTokens: dto.maxTokens || 2048,
        initialMessage: dto.initialMessage || null,
        systemPrompt: dto.systemPrompt || null,
        objective: dto.objective || null,
        instructions: dto.instructions || null,
        language: dto.language || 'pt-BR',
        creativity: dto.creativity || 'BALANCED',
        memoryEnabled: dto.memoryEnabled !== undefined ? dto.memoryEnabled : true,
        memoryConfig: typeof dto.memoryConfig === 'string' ? dto.memoryConfig : JSON.stringify(dto.memoryConfig || {}),
        knowledgeBaseIds: dto.knowledgeBaseIds || null,
        toolsConfig: typeof dto.toolsConfig === 'string' ? dto.toolsConfig : JSON.stringify(dto.toolsConfig || {}),
        isPublished: dto.isPublished !== undefined ? dto.isPublished : true,
        version: 1,
      },
    });

    // Se houver um systemPrompt, criar a versão 1 no AiPrompt e AiPromptVersion
    if (dto.systemPrompt) {
      const prompt = await this.prisma.aiPrompt.create({
        data: {
          companyId,
          agentId: agent.id,
          title: `Prompt v1 - ${agent.name}`,
          content: dto.systemPrompt,
          currentVer: 1,
        },
      });

      await this.prisma.aiPromptVersion.create({
        data: {
          promptId: prompt.id,
          version: 1,
          content: dto.systemPrompt,
          changelog: 'Criação inicial do agente no Wizard',
          authorId: actorUserId || null,
        },
      });
    }

    await this.auditLogsService.log({
      companyId,
      userId: actorUserId,
      action: 'AI_AGENT_CREATE',
      entity: 'AiAgent',
      entityId: agent.id,
      payload: { name: agent.name, category: agent.category, model: agent.modelName },
    });

    return agent;
  }

  async findAll(
    companyId: string,
    search?: string,
    status?: string,
    category?: string,
    modelName?: string,
    responsibleId?: string,
  ) {
    const where: any = { companyId };

    if (status) where.status = status;
    if (category) where.category = category;
    if (modelName) where.modelName = modelName;
    if (responsibleId) where.responsibleId = responsibleId;

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { category: { contains: search } },
        { objective: { contains: search } },
      ];
    }

    return this.prisma.aiAgent.findMany({
      where,
      include: {
        responsible: { select: { id: true, name: true, email: true } },
        executions: { take: 1, orderBy: { createdAt: 'desc' } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, companyId: string, isSuperAdmin = false) {
    const agent = await this.prisma.aiAgent.findUnique({
      where: { id },
      include: {
        responsible: { select: { id: true, name: true, email: true } },
        executions: { take: 10, orderBy: { createdAt: 'desc' } },
        prompts: {
          include: {
            versions: { orderBy: { version: 'desc' } },
          },
        },
        knowledgeBases: true,
      },
    });

    if (!agent) {
      throw new NotFoundException('Agente de IA não encontrado.');
    }

    if (!isSuperAdmin && agent.companyId !== companyId) {
      throw new ForbiddenException('Acesso negado ao Agente de IA.');
    }

    return agent;
  }

  async update(id: string, companyId: string, dto: UpdateAgentDto, actorUserId?: string, isSuperAdmin = false) {
    const existing = await this.findOne(id, companyId, isSuperAdmin);

    const updateData: any = { ...dto };

    if (dto.selectedTools && !dto.toolsConfig) {
      updateData.toolsConfig = JSON.stringify({ tools: dto.selectedTools });
    }
    delete updateData.selectedTools;

    if (dto.memoryConfig && typeof dto.memoryConfig !== 'string') {
      updateData.memoryConfig = JSON.stringify(dto.memoryConfig);
    }
    if (dto.toolsConfig && typeof dto.toolsConfig !== 'string') {
      updateData.toolsConfig = JSON.stringify(dto.toolsConfig);
    }

    // Se o systemPrompt mudou, incrementa a versão e registra a nova versão no histórico
    if (dto.systemPrompt && dto.systemPrompt !== existing.systemPrompt) {
      updateData.version = (existing.version || 1) + 1;

      let prompt = existing.prompts?.[0];
      if (!prompt) {
        prompt = await this.prisma.aiPrompt.create({
          data: {
            companyId,
            agentId: id,
            title: `Prompt - ${existing.name}`,
            content: dto.systemPrompt,
            currentVer: updateData.version,
          },
          include: { versions: true },
        });
      } else {
        await this.prisma.aiPrompt.update({
          where: { id: prompt.id },
          data: { content: dto.systemPrompt, currentVer: updateData.version },
        });
      }

      await this.prisma.aiPromptVersion.create({
        data: {
          promptId: prompt.id,
          version: updateData.version,
          content: dto.systemPrompt,
          changelog: `Atualização v${updateData.version} de instruções do agente`,
          authorId: actorUserId || null,
        },
      });
    }

    const updated = await this.prisma.aiAgent.update({
      where: { id },
      data: updateData,
      include: {
        responsible: { select: { id: true, name: true, email: true } },
        prompts: { include: { versions: true } },
      },
    });

    await this.auditLogsService.log({
      companyId,
      userId: actorUserId,
      action: 'AI_AGENT_UPDATE',
      entity: 'AiAgent',
      entityId: id,
      payload: dto,
    });

    return updated;
  }

  async archive(id: string, companyId: string, actorUserId?: string, isSuperAdmin = false) {
    await this.findOne(id, companyId, isSuperAdmin);

    const updated = await this.prisma.aiAgent.update({
      where: { id },
      data: { status: 'ARCHIVED', isActive: false },
    });

    await this.auditLogsService.log({
      companyId,
      userId: actorUserId,
      action: 'AI_AGENT_ARCHIVE',
      entity: 'AiAgent',
      entityId: id,
    });

    return updated;
  }

  async publish(id: string, companyId: string, actorUserId?: string, isSuperAdmin = false) {
    await this.findOne(id, companyId, isSuperAdmin);

    const updated = await this.prisma.aiAgent.update({
      where: { id },
      data: { isPublished: true, status: 'ACTIVE', isActive: true },
    });

    await this.auditLogsService.log({
      companyId,
      userId: actorUserId,
      action: 'AI_AGENT_PUBLISH',
      entity: 'AiAgent',
      entityId: id,
    });

    return updated;
  }

  async duplicate(id: string, companyId: string, actorUserId?: string, isSuperAdmin = false) {
    const original = await this.findOne(id, companyId, isSuperAdmin);

    const copy = await this.prisma.aiAgent.create({
      data: {
        companyId,
        name: `${original.name} (Cópia)`,
        avatar: original.avatar,
        description: original.description,
        category: original.category,
        responsibleId: actorUserId || original.responsibleId,
        modelName: original.modelName,
        provider: original.provider,
        status: 'ACTIVE',
        personality: original.personality,
        toneOfVoice: original.toneOfVoice,
        emoji: original.emoji,
        temperature: original.temperature,
        maxTokens: original.maxTokens,
        initialMessage: original.initialMessage,
        systemPrompt: original.systemPrompt,
        objective: original.objective,
        instructions: original.instructions,
        language: original.language,
        creativity: original.creativity,
        memoryEnabled: original.memoryEnabled,
        memoryConfig: original.memoryConfig,
        knowledgeBaseIds: original.knowledgeBaseIds,
        toolsConfig: original.toolsConfig,
        isPublished: true,
        version: 1,
      },
    });

    await this.auditLogsService.log({
      companyId,
      userId: actorUserId,
      action: 'AI_AGENT_DUPLICATE',
      entity: 'AiAgent',
      entityId: copy.id,
      payload: { originalId: id, newName: copy.name },
    });

    return copy;
  }

  async remove(id: string, companyId: string, actorUserId?: string, isSuperAdmin = false) {
    const agent = await this.findOne(id, companyId, isSuperAdmin);

    await this.prisma.aiAgent.delete({
      where: { id },
    });

    await this.auditLogsService.log({
      companyId,
      userId: actorUserId,
      action: 'AI_AGENT_DELETE',
      entity: 'AiAgent',
      entityId: id,
      payload: { name: agent.name },
    });

    return { message: 'Agente excluído com sucesso.' };
  }

  async toggleStatus(id: string, companyId: string, actorUserId?: string, isSuperAdmin = false) {
    const agent = await this.findOne(id, companyId, isSuperAdmin);
    const newStatus = agent.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    const updated = await this.prisma.aiAgent.update({
      where: { id },
      data: { status: newStatus, isActive: newStatus === 'ACTIVE' },
    });

    await this.auditLogsService.log({
      companyId,
      userId: actorUserId,
      action: 'AI_AGENT_TOGGLE_STATUS',
      entity: 'AiAgent',
      entityId: id,
      payload: { status: newStatus },
    });

    return updated;
  }
}
