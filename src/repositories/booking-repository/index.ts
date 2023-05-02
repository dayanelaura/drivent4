import { Booking } from '@prisma/client';
import { prisma } from '@/config';

type CreateBookingParams = Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateBookingParams = Omit<Booking, 'createdAt' | 'updatedAt'>;

async function create({ roomId, userId }: CreateBookingParams): Promise<Booking> {
  return prisma.booking.create({
    data: {
      roomId,
      userId,
    },
  });
}

async function findBookingByRoomId(roomId: number) {
  return prisma.booking.findMany({
    where: {
      roomId,
    },
    include: {
      Room: true,
    },
  });
}

async function findBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    },
  });
}

async function upsertBooking({ id, roomId, userId }: UpdateBookingParams) {
  return prisma.booking.upsert({
    where: {
      id,
    },
    create: {
      roomId,
      userId,
    },
    update: {
      roomId,
    },
  });
}

const bookingRepository = {
  create,
  findBookingByRoomId,
  findBookingByUserId,
  upsertBooking,
};

export default bookingRepository;
