import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, eventId: string, data: any) {
    // Verify event exists
    const event = await this.prisma.event.findFirst({
      where: { id: eventId, tenantId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.prisma.ticket.create({
      data: {
        tenantId,
        eventId,
        name: data.name,
        description: data.description,
        price: data.price || 0,
        currency: data.currency || 'USD',
        quantity: data.quantity,
        isEarlyBird: data.isEarlyBird || false,
        earlyBirdEndDate: data.earlyBirdEndDate,
      },
    });
  }

  async findAll(tenantId: string, eventId: string) {
    return this.prisma.ticket.findMany({
      where: { tenantId, eventId },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
      orderBy: { price: 'asc' },
    });
  }

  async findOne(tenantId: string, eventId: string, id: string) {
    const ticket = await this.prisma.ticket.findFirst({
      where: { id, eventId, tenantId },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return ticket;
  }

  async update(tenantId: string, eventId: string, id: string, data: any) {
    await this.findOne(tenantId, eventId, id);
    return this.prisma.ticket.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        currency: data.currency,
        quantity: data.quantity,
        isEarlyBird: data.isEarlyBird,
        earlyBirdEndDate: data.earlyBirdEndDate,
        isActive: data.isActive,
      },
    });
  }

  async checkAvailability(tenantId: string, ticketId: string, quantity: number = 1) {
    const ticket = await this.prisma.ticket.findFirst({
      where: { id: ticketId, tenantId },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (!ticket.isActive) {
      throw new BadRequestException('Ticket is not active');
    }

    if (ticket.quantity !== null && ticket.sold + quantity > ticket.quantity) {
      throw new BadRequestException('Insufficient tickets available');
    }

    // Check early bird pricing
    let finalPrice = Number(ticket.price);
    if (ticket.isEarlyBird && ticket.earlyBirdEndDate && new Date() <= ticket.earlyBirdEndDate) {
      // Apply early bird discount (could be in settings)
      finalPrice = Number(ticket.price) * 0.8; // 20% discount example
    }

    return {
      available: true,
      price: finalPrice,
      currency: ticket.currency,
    };
  }

  async delete(tenantId: string, eventId: string, id: string) {
    await this.findOne(tenantId, eventId, id);
    await this.prisma.ticket.delete({ where: { id } });
    return { message: 'Ticket deleted successfully' };
  }
}
