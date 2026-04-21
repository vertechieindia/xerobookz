import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SkillService } from './skill.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('skills')
@Controller('employees/:employeeId/skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add or update employee skill' })
  async addSkill(
    @TenantId() tenantId: string,
    @Param('employeeId') employeeId: string,
    @Body() data: any,
  ) {
    return this.skillService.addSkill(tenantId, employeeId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get employee skills' })
  async getSkills(
    @TenantId() tenantId: string,
    @Param('employeeId') employeeId: string,
  ) {
    return this.skillService.getEmployeeSkills(tenantId, employeeId);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search employees by skills' })
  async searchBySkills(
    @TenantId() tenantId: string,
    @Query('skills') skills: string,
  ) {
    const skillsArray = skills.split(',').map((s) => s.trim());
    return this.skillService.searchBySkills(tenantId, skillsArray);
  }

  @Delete(':skillName')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove employee skill' })
  async removeSkill(
    @TenantId() tenantId: string,
    @Param('employeeId') employeeId: string,
    @Param('skillName') skillName: string,
  ) {
    return this.skillService.removeSkill(tenantId, employeeId, skillName);
  }
}
