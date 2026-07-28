import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Erro interno no servidor.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    } else if (exception && typeof exception === 'object' && 'code' in exception) {
      // Tratamento de exceções conhecidas do Prisma ORM
      const prismaError = exception as { code: string; meta?: any };
      if (prismaError.code === 'P2002') {
        status = HttpStatus.BAD_REQUEST;
        const target = prismaError.meta?.target;
        message = `Já existe um registro com estes dados únicos (${Array.isArray(target) ? target.join(', ') : 'campo único'}) no sistema.`;
      } else if (prismaError.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        message = 'O registro solicitado não foi encontrado no banco de dados.';
      } else if (prismaError.code === 'P2003') {
        status = HttpStatus.BAD_REQUEST;
        message = 'Operação não permitida por restrição de relacionamento (chave estrangeira).';
      }
    }

    const companyId = (request as any).companyId || 'N/A';
    const userId = (request as any).user?.userId || 'Anônimo';

    this.logger.error(
      `[${request.method}] ${request.url} - Status: ${status} - Tenant: ${companyId} - User: ${userId}`,
      exception instanceof Error ? exception.stack : JSON.stringify(exception),
    );

    const errorMessage = typeof message === 'object' && (message as any).message ? (message as any).message : message;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: errorMessage,
    });
  }
}
