import { IsNotEmpty, IsEnum } from 'class-validator';

export enum CompanyStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export class UpdateCompanyStatusDto {
  @IsNotEmpty({ message: 'Status da empresa é obrigatório.' })
  @IsEnum(CompanyStatusEnum)
  status: CompanyStatusEnum;
}
