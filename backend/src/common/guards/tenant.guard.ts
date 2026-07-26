import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const tenantId = request.tenantId;

    if (!user) {
      throw new ForbiddenException('Usuário não autenticado.');
    }

    // SUPER_ADMIN tem acesso global
    if (user.role === 'SUPER_ADMIN') {
      return true;
    }

    if (!tenantId || user.companyId !== tenantId) {
      throw new ForbiddenException('Acesso negado. Tentativa de violação de escopo de empresa (Multi-Tenant).');
    }

    return true;
  }
}
