import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class UpdateProviderConfigDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do provedor é obrigatório' })
  providerName: string;

  @IsString()
  @IsOptional()
  status?: string; // ACTIVE, INACTIVE, DEGRADED

  @IsString()
  @IsOptional()
  defaultModel?: string;

  @IsNumber()
  @IsOptional()
  timeoutMs?: number;

  @IsNumber()
  @IsOptional()
  retryCount?: number;

  @IsBoolean()
  @IsOptional()
  fallbackEnabled?: boolean;

  @IsBoolean()
  @IsOptional()
  streamingEnabled?: boolean;

  @IsNumber()
  @IsOptional()
  dailyTokenLimit?: number;

  @IsNumber()
  @IsOptional()
  monthlyTokenLimit?: number;

  @IsNumber()
  @IsOptional()
  requestTokenLimit?: number;
}
