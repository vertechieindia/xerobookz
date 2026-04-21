"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
  requiredPermissions?: string[];
  requiredScopes?: string[];
}

export function AuthGuard({ 
  children, 
  requiredRole,
  requiredPermissions,
  requiredScopes 
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, user, mfaRequired } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      if (pathname?.startsWith('/super-admin')) {
        router.push('/super-admin-accessportal');
      } else {
        router.push('/login');
      }
      return;
    }

    if (mfaRequired) {
      router.push('/auth/mfa');
      return;
    }

    // Check role (user.role primary, or any of user.roles)
    if (requiredRole && user) {
      const allowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      const userRoles = [user.role, ...(user.roles || [])].filter(Boolean);
      const hasRole = allowed.some((r) => userRoles.includes(r));
      if (!hasRole) {
        router.push('/unauthorized');
        return;
      }
    }

    // Check permissions
    if (requiredPermissions && user?.permissions) {
      const hasAllPermissions = requiredPermissions.every(perm => 
        user.permissions?.includes(perm)
      );
      if (!hasAllPermissions) {
        router.push('/unauthorized');
        return;
      }
    }

    // Check scopes
    if (requiredScopes && user?.scopes) {
      const hasAllScopes = requiredScopes.every(scope => 
        user.scopes?.includes(scope)
      );
      if (!hasAllScopes) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, mfaRequired, requiredRole, requiredPermissions, requiredScopes, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-grey-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || mfaRequired) {
    return null;
  }

  return <>{children}</>;
}
