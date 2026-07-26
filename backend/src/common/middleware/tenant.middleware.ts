import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const tenantHeader = req.headers['x-tenant-id'] as string;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.decode(token) as any;
        if (decoded && decoded.companyId) {
          req['tenantId'] = decoded.companyId;
          req['user'] = decoded;
        }
      } catch (e) {
        // Erros de JWT tratados pelo JwtAuthGuard
      }
    }

    if (!req['tenantId'] && tenantHeader) {
      req['tenantId'] = tenantHeader;
    }

    next();
  }
}
