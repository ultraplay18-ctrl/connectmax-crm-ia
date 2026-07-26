import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateMemoryProfileDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do cliente é obrigatório' })
  customerName: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  preferences?: string;

  @IsString()
  @IsOptional()
  language?: string;

  @IsString()
  @IsOptional()
  toneOfVoice?: string;

  @IsString()
  @IsOptional()
  interestedItems?: string;

  @IsString()
  @IsOptional()
  lastPurchase?: string;

  @IsNumber()
  @IsOptional()
  satisfactionScore?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
