import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCompanyPlanDto {
  @IsNotEmpty({ message: 'ID do plano é obrigatório.' })
  @IsString()
  planId: string;
}
