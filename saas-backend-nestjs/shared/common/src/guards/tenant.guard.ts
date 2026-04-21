import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const tenantId = request.headers['x-tenant-id'];

    // Allow health checks and public endpoints
    if (
      request.url === '/health' ||
      request.url.startsWith('/api/v1/auth/login') ||
      request.url.startsWith('/api/v1/auth/register')
    ) {
      return true;
    }

    if (!tenantId) {
      throw new UnauthorizedException('X-Tenant-ID header is required');
    }

    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(tenantId as string)) {
      throw new UnauthorizedException('Invalid tenant ID format');
    }

    return true;
  }
}
