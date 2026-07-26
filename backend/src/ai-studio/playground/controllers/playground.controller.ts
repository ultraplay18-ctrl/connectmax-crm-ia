import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PlaygroundService } from '../services/playground.service';
import { ExecutePlaygroundDto } from '../dto/execute-playground.dto';
import { SavePresetDto } from '../dto/save-preset.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentUser, JwtPayloadUser } from '../../../common/decorators/current-user.decorator';

@Controller('ai-studio/playground')
@UseGuards(JwtAuthGuard, TenantGuard)
export class PlaygroundController {
  constructor(private readonly playgroundService: PlaygroundService) {}

  @Post('execute')
  async executeSimulatedRun(@CurrentUser() user: JwtPayloadUser, @Body() dto: ExecutePlaygroundDto) {
    return this.playgroundService.executeSimulatedRun(user.companyId, dto, user.userId);
  }

  @Post('presets')
  async savePreset(@CurrentUser() user: JwtPayloadUser, @Body() dto: SavePresetDto) {
    return this.playgroundService.savePreset(user.companyId, dto);
  }

  @Get('presets')
  async getPresets(@CurrentUser('companyId') companyId: string) {
    return this.playgroundService.getPresets(companyId);
  }

  @Get('sessions')
  async getSessions(@CurrentUser('companyId') companyId: string) {
    return this.playgroundService.getSessions(companyId);
  }
}
