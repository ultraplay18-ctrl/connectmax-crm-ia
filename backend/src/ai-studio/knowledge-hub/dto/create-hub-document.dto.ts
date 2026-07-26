import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateHubDocumentDto {
  @IsString()
  @IsNotEmpty({ message: 'O ID da biblioteca é obrigatório' })
  libraryId: string;

  @IsString()
  @IsNotEmpty({ message: 'O nome do documento é obrigatório' })
  name: string;

  @IsString()
  @IsOptional()
  fileType?: string; // PDF, DOCX, XLSX, CSV, TXT, MD, HTML, JSON

  @IsNumber()
  @IsOptional()
  fileSize?: number;

  @IsString()
  @IsOptional()
  fileUrl?: string;

  @IsString()
  @IsOptional()
  content?: string;
}
