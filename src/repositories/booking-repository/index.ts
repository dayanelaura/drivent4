import { Booking } from '@prisma/client';
import { prisma } from '@/config';

type CreateBookingParams = Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>;

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

const bookingRepository = {
  findBookingByRoomId,
  findBookingByUserId,
};

export default bookingRepository;
