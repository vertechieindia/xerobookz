import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { CreateLeadDto } from './dto/create-lead.dto';
import { AIService } from '../ai/ai.service';

@Injectable()
export class LeadService {
  constructor(
    private prisma: PrismaService,
    private aiService: AIService,
  ) {}

  async create(tenantId: string, dto: CreateLeadDto) {
    // Calculate AI lead score
    const score = await this.aiService.scoreLead(dto);

    const lead = await this.prisma.lead.create({
      data: {
        tenantId,
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        company: dto.company,
        title: dto.title,
        source: dto.source || 'manual',
        status: 'new',
        score,
        notes: dto.notes,
        tags: dto.tags || [],
        assignedToId: dto.assignedToId,
      },
      include: {
        opportunities: true,
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    return lead;
  }

  async findAll(tenantId: string, filters?: { status?: string; assignedToId?: string }) {
    return this.prisma.lead.findMany({
      where: {
        tenantId,
        ...(filters?.status && { status: filters.status }),
        ...(filters?.assignedToId && { assignedToId: filters.assignedToId }),
      },
      include: {
        opportunities: {
          select: {
            id: true,
            name: true,
            expectedRevenue: true,
            stage: true,
          },
        },
        _count: {
          select: { activities: true, opportunities: true },
        },
      },
      orderBy: [
        { score: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findOne(tenantId: string, id: string) {
    const lead = await this.prisma.lead.findFirst({
      where: { id, tenantId },
      include: {
        opportunities: {
          include: {
            quotations: true,
          },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
        },
        contacts: true,
      },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return lead;
  }

  async update(tenantId: string, id: string, dto: Partial<CreateLeadDto>) {
    await this.findOne(tenantId, id);

    // Recalculate score if relevant fields changed
    let score: number | undefined;
    if (dto.name || dto.company || dto.email) {
      const lead = await this.prisma.lead.findUnique({ where: { id } });
      if (lead) {
        score = await this.aiService.scoreLead({
          name: dto.name || lead.name,
          company: dto.company || lead.company,
          email: dto.email || lead.email,
        });
      }
    }

    return this.prisma.lead.update({
      where: { id },
      data: {
        ...dto,
        ...(score !== undefined && { score }),
      },
      include: {
        opportunities: true,
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });
  }

  async convertToOpportunity(tenantId: string, id: string, opportunityData: any) {
    const lead = await this.findOne(tenantId, id);

    const opportunity = await this.prisma.opportunity.create({
      data: {
        tenantId,
        leadId: lead.id,
        contactId: opportunityData.contactId,
        name: opportunityData.name || `Opportunity from ${lead.name}`,
        expectedRevenue: opportunityData.expectedRevenue || 0,
        probability: opportunityData.probability || 50,
        stage: 'new',
        expectedCloseDate: opportunityData.expectedCloseDate,
        assignedToId: opportunityData.assignedToId || lead.assignedToId,
        notes: opportunityData.notes,
        tags: opportunityData.tags || [],
      },
    });

    // Update lead status
    await this.prisma.lead.update({
      where: { id },
      data: { status: 'converted' },
    });

    return opportunity;
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.lead.delete({ where: { id } });
    return { message: 'Lead deleted successfully' };
  }
}
