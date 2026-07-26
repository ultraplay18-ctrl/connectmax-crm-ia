import { IsOptional, IsString } from 'class-validator';

export class UpdateCompanySettingsDto {
  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  primaryColor?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  onboardingCompleted?: boolean;

  @IsOptional()
  onboardingProgress?: number;
}
