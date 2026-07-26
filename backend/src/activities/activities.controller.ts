import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentUser, JwtPayloadUser } from '../common/decorators/current-user.decorator';

@Controller('activities')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  // ==================== TAREFAS ====================
  @Post('tasks')
  async createTask(@CurrentUser() user: JwtPayloadUser, @Body() dto: CreateTaskDto) {
    return this.activitiesService.createTask(user.companyId, dto, user.userId);
  }

  @Get('tasks')
  async findAllTasks(
    @CurrentUser('companyId') companyId: string,
    @Query('status') status?: string,
    @Query('assignedUserId') assignedUserId?: string,
  ) {
    return this.activitiesService.findAllTasks(companyId, status, assignedUserId);
  }

  @Patch('tasks/:id')
  async updateTask(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayloadUser,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.activitiesService.updateTask(id, user.companyId, dto, user.userId, user.role === 'SUPER_ADMIN');
  }

  @Delete('tasks/:id')
  async deleteTask(@Param('id') id: string, @CurrentUser() user: JwtPayloadUser) {
    return this.activitiesService.deleteTask(id, user.companyId, user.userId, user.role === 'SUPER_ADMIN');
  }

  // ==================== INTERAÇÕES ====================
  @Post('interactions')
  async createInteraction(@CurrentUser() user: JwtPayloadUser, @Body() dto: CreateInteractionDto) {
    return this.activitiesService.createInteraction(user.companyId, user.userId, dto);
  }

  @Get('interactions')
  async findAllInteractions(
    @CurrentUser('companyId') companyId: string,
    @Query('contactId') contactId?: string,
    @Query('leadId') leadId?: string,
  ) {
    return this.activitiesService.findAllInteractions(companyId, contactId, leadId);
  }

  // ==================== EVENTOS / AGENDA ====================
  @Post('events')
  async createEvent(@CurrentUser() user: JwtPayloadUser, @Body() dto: CreateEventDto) {
    return this.activitiesService.createEvent(user.companyId, dto, user.userId);
  }

  @Get('events')
  async findAllEvents(
    @CurrentUser('companyId') companyId: string,
    @Query('assignedUserId') assignedUserId?: string,
  ) {
    return this.activitiesService.findAllEvents(companyId, assignedUserId);
  }

  @Patch('events/:id')
  async updateEvent(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayloadUser,
    @Body() dto: UpdateEventDto,
  ) {
    return this.activitiesService.updateEvent(id, user.companyId, dto, user.userId, user.role === 'SUPER_ADMIN');
  }

  @Delete('events/:id')
  async deleteEvent(@Param('id') id: string, @CurrentUser() user: JwtPayloadUser) {
    return this.activitiesService.deleteEvent(id, user.companyId, user.userId, user.role === 'SUPER_ADMIN');
  }
}
