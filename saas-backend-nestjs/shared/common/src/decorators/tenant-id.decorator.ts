import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extracts tenant ID from request headers
 * Usage: @TenantId() tenantId: string
 */
export const TenantId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const tenantId = request.headers['x-tenant-id'];
    
    if (!tenantId) {
      throw new Error('X-Tenant-ID header is required');
    }
    
    return tenantId;
  },
);
