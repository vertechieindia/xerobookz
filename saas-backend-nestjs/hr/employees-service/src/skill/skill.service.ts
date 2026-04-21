import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class SkillService {
  constructor(private prisma: PrismaService) {}

  async addSkill(tenantId: string, employeeId: string, data: any) {
    // Verify employee exists
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId, tenantId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return this.prisma.employeeSkill.upsert({
      where: {
        employeeId_skillName: {
          employeeId,
          skillName: data.skillName,
        },
      },
      update: {
        level: data.level,
        certification: data.certification,
        notes: data.notes,
      },
      create: {
        tenantId,
        employeeId,
        skillName: data.skillName,
        level: data.level,
        certification: data.certification,
        notes: data.notes,
      },
    });
  }

  async getEmployeeSkills(tenantId: string, employeeId: string) {
    return this.prisma.employeeSkill.findMany({
      where: { tenantId, employeeId },
      orderBy: { skillName: 'asc' },
    });
  }

  async searchBySkills(tenantId: string, skills: string[]) {
    return this.prisma.employeeSkill.findMany({
      where: {
        tenantId,
        skillName: { in: skills },
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            jobTitle: true,
            departmentId: true,
          },
        },
      },
    });
  }

  async removeSkill(tenantId: string, employeeId: string, skillName: string) {
    await this.prisma.employeeSkill.deleteMany({
      where: {
        tenantId,
        employeeId,
        skillName,
      },
    });
    return { message: 'Skill removed successfully' };
  }
}
