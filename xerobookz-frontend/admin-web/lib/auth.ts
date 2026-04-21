"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  tenant_id?: string;
  permissions?: string[];
  scopes?: string[];
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  mfaRequired: boolean;
  mfaVerified: boolean;
}

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    mfaRequired: false,
    mfaVerified: false,
  });

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('xerobookz_token');
      const refreshToken = localStorage.getItem('xerobookz_refresh_token');
      
      if (!token) {
        setAuthState(prev => ({ ...prev, isLoading: false, isAuthenticated: false }));
        redirectToLogin();
        return;
      }

      // Verify token with backend
      const response = await fetch('/api/v1/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Try refresh token
        if (refreshToken) {
          const refreshResponse = await fetch('/api/v1/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });

          if (refreshResponse.ok) {
            const data = await refreshResponse.json();
            localStorage.setItem('xerobookz_token', data.data.access_token);
            setAuthState(prev => ({
              ...prev,
              token: data.data.access_token,
              isAuthenticated: true,
              isLoading: false,
            }));
            return;
          }
        }

        // Both failed, redirect to login
        localStorage.removeItem('xerobookz_token');
        localStorage.removeItem('xerobookz_refresh_token');
        setAuthState(prev => ({ ...prev, isLoading: false, isAuthenticated: false }));
        redirectToLogin();
        return;
      }

      const data = await response.json();
      const user = data.data;

      // Check if MFA is required
      if (user.mfa_enabled && !user.mfa_verified) {
        setAuthState(prev => ({
          ...prev,
          user: user,
          token: token,
          isAuthenticated: false,
          isLoading: false,
          mfaRequired: true,
        }));
        return;
      }

      // Check route access (allow if user.role or any of user.roles matches)
      if (!checkRouteAccess(pathname, user.role, user.roles)) {
        router.push('/unauthorized');
        return;
      }

      setAuthState(prev => ({
        ...prev,
        user: user,
        token: token,
        isAuthenticated: true,
        isLoading: false,
        mfaRequired: false,
        mfaVerified: true,
      }));
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState(prev => ({ ...prev, isLoading: false, isAuthenticated: false }));
      redirectToLogin();
    }
  };

  const redirectToLogin = () => {
    if (pathname?.startsWith('/super-admin')) {
      router.push('/super-admin-accessportal');
    } else {
      router.push('/login');
    }
  };

  const checkRouteAccess = (path: string, role?: string, roles?: string[]): boolean => {
    const userRoles = [role, ...(roles || [])].filter(Boolean) as string[];
    if (path?.startsWith('/super-admin')) {
      return userRoles.includes('super_admin');
    }
    if (path?.startsWith('/company-admin')) {
      return userRoles.some((r) => ['admin', 'hrbp', 'manager', 'contract_manager'].includes(r));
    }
    if (path?.startsWith('/contract-team')) {
      return userRoles.some((r) => ['contract_manager', 'admin'].includes(r));
    }
    if (path?.startsWith('/employee')) {
      return userRoles.some((r) => ['employee', 'admin', 'hrbp', 'manager'].includes(r));
    }
    return true;
  };

  const logout = () => {
    localStorage.removeItem('xerobookz_token');
    localStorage.removeItem('xerobookz_refresh_token');
    localStorage.removeItem('xerobookz_tenant_id');
    localStorage.removeItem('xerobookz_user_role');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      mfaRequired: false,
      mfaVerified: false,
    });
    router.push('/login');
  };

  return {
    ...authState,
    logout,
    checkAuth,
  };
}
