import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class RegistrationService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, eventId: string, data: any) {
    // Verify event exists
    const event = await this.prisma.event.findFirst({
      where: { id: eventId, tenantId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Check ticket availability if ticket specified
    let ticket = null;
    let totalAmount = 0;

    if (data.ticketId) {
      ticket = await this.prisma.ticket.findFirst({
        where: { id: data.ticketId, eventId, tenantId },
      });

      if (!ticket) {
        throw new NotFoundException('Ticket not found');
      }

      if (!ticket.isActive) {
        throw new BadRequestException('Ticket is not active');
      }

      if (ticket.quantity !== null && ticket.sold >= ticket.quantity) {
        throw new BadRequestException('Ticket sold out');
      }

      // Calculate price (check early bird)
      totalAmount = Number(ticket.price);
      if (ticket.isEarlyBird && ticket.earlyBirdEndDate && new Date() <= ticket.earlyBirdEndDate) {
        totalAmount = Number(ticket.price) * 0.8; // Early bird discount
      }

      // Update sold count
      await this.prisma.ticket.update({
        where: { id: ticket.id },
        data: { sold: { increment: 1 } },
      });
    }

    const registration = await this.prisma.eventRegistration.create({
      data: {
        tenantId,
        eventId,
        ticketId: data.ticketId,
        attendeeName: data.attendeeName,
        attendeeEmail: data.attendeeEmail,
        attendeePhone: data.attendeePhone,
        totalAmount,
        currency: ticket?.currency || 'USD',
        metadata: data.metadata || {},
      },
    });

    return registration;
  }

  async findAll(tenantId: string, eventId: string, filters?: { status?: string }) {
    return this.prisma.eventRegistration.findMany({
      where: {
        tenantId,
        eventId,
        ...(filters?.status && { status: filters.status }),
      },
      include: {
        ticket: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, eventId: string, id: string) {
    const registration = await this.prisma.eventRegistration.findFirst({
      where: { id, eventId, tenantId },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
            location: true,
          },
        },
        ticket: true,
      },
    });

    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    return registration;
  }

  async checkIn(tenantId: string, eventId: string, id: string) {
    const registration = await this.findOne(tenantId, eventId, id);

    if (registration.status !== 'confirmed') {
      throw new BadRequestException('Registration must be confirmed to check in');
    }

    return this.prisma.eventRegistration.update({
      where: { id },
      data: {
        status: 'attended',
        checkedInAt: new Date(),
      },
    });
  }

  async cancel(tenantId: string, eventId: string, id: string) {
    const registration = await this.findOne(tenantId, eventId, id);

    // Refund ticket if paid
    if (registration.ticketId && registration.paymentStatus === 'paid') {
      // In production, process refund
      await this.prisma.ticket.update({
        where: { id: registration.ticketId },
        data: { sold: { decrement: 1 } },
      });
    }

    return this.prisma.eventRegistration.update({
      where: { id },
      data: {
        status: 'cancelled',
        paymentStatus: registration.paymentStatus === 'paid' ? 'refunded' : registration.paymentStatus,
      },
    });
  }

  async confirmPayment(tenantId: string, eventId: string, id: string) {
    const registration = await this.findOne(tenantId, eventId, id);
    return this.prisma.eventRegistration.update({
      where: { id },
      data: {
        status: 'confirmed',
        paymentStatus: 'paid',
      },
    });
  }
}
