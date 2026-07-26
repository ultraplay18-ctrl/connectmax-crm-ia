import { IsEnum, IsNotEmpty } from 'class-validator';
import { LeadStatus } from './create-lead.dto';

export class UpdateLeadStatusDto {
  @IsNotEmpty({ message: 'Status / Etapa do Kanban é obrigatória.' })
  @IsEnum(LeadStatus)
  status: LeadStatus;
}
