import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@xerobookz/shared-database';
import { PasswordUtil } from '@xerobookz/shared-auth';
import { LoginDto, RegisterDto, RefreshTokenDto } from './dto';
import { JwtPayload } from '@xerobookz/shared-auth';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    tenantId: string;
    roles: string[];
  };
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const passwordHash = await PasswordUtil.hash(dto.password);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });

    // If tenantId provided, create user-tenant relationship
    let tenantId = dto.tenantId;
    if (tenantId) {
      const tenant = await this.prisma.tenant.findUnique({
        where: { id: tenantId },
      });

      if (!tenant) {
        throw new BadRequestException('Invalid tenant ID');
      }

      await this.prisma.userTenant.create({
        data: {
          userId: user.id,
          tenantId: tenant.id,
          role: 'user',
        },
      });
    } else {
      // For now, create a default tenant or handle tenant creation separately
      // This is a simplified version - in production, tenant creation should be handled by tenant-service
      throw new BadRequestException('Tenant ID is required');
    }

    // Get user roles from user-tenant relationship
    const userTenant = await this.prisma.userTenant.findFirst({
      where: { userId: user.id, tenantId },
    });

    const roles = userTenant ? [userTenant.role] : [];

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, tenantId, roles);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        tenantId,
        roles,
      },
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    // Verify password
    const isPasswordValid = await PasswordUtil.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Determine tenant
    let tenantId = dto.tenantId;
    if (!tenantId) {
      // Get first active tenant for user
      const userTenant = await this.prisma.userTenant.findFirst({
        where: { userId: user.id, isActive: true },
        include: { tenant: true },
      });

      if (!userTenant) {
        throw new BadRequestException('User has no active tenant');
      }

      tenantId = userTenant.tenantId;
    } else {
      // Verify user has access to this tenant
      const userTenant = await this.prisma.userTenant.findFirst({
        where: { userId: user.id, tenantId, isActive: true },
      });

      if (!userTenant) {
        throw new UnauthorizedException('User does not have access to this tenant');
      }
    }

    // Get user roles
    const userTenant = await this.prisma.userTenant.findFirst({
      where: { userId: user.id, tenantId, isActive: true },
    });

    const roles = userTenant ? [userTenant.role] : [];

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, tenantId, roles);

    // Create session
    await this.createSession(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        tenantId,
        roles,
      },
    };
  }

  async refreshToken(dto: RefreshTokenDto): Promise<{ accessToken: string }> {
    // Find refresh token
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { token: dto.refreshToken },
      include: { user: true },
    });

    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (refreshToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    // Get user's active tenant
    const userTenant = await this.prisma.userTenant.findFirst({
      where: { userId: refreshToken.userId, isActive: true },
    });

    if (!userTenant) {
      throw new UnauthorizedException('User has no active tenant');
    }

    const roles = [userTenant.role];

    // Generate new access token
    const payload: JwtPayload = {
      sub: refreshToken.userId,
      email: refreshToken.user.email,
      tenantId: userTenant.tenantId,
      roles,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '15m',
    });

    return { accessToken };
  }

  async logout(userId: string, refreshToken?: string): Promise<void> {
    // Delete session
    if (refreshToken) {
      await this.prisma.session.deleteMany({
        where: { userId, token: refreshToken },
      });
    }

    // Optionally delete all refresh tokens for user
    // await this.prisma.refreshToken.deleteMany({
    //   where: { userId },
    // });
  }

  private async generateTokens(
    userId: string,
    email: string,
    tenantId: string,
    roles: string[],
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = {
      sub: userId,
      email,
      tenantId,
      roles,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
    });

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.prisma.refreshToken.create({
      data: {
        userId,
        token: refreshToken,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }

  private async createSession(userId: string, token: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.prisma.session.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }
}
