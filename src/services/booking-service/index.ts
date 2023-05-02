import { notFoundError } from '@/errors';
import roomRepository from '@/repositories/room-repository';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepository from '@/repositories/tickets-repository';
import { cannotBookingError } from '@/errors/cannot-booking-error';

async function getBooking(userId: number) {
  const booking = await bookingRepository.findBookingByUserId(userId);

  if (!booking) throw notFoundError();

  return booking;
}

async function checkEnrollmentTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) throw cannotBookingError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel)
    throw cannotBookingError();
}

async function checkValidBooking(roomId: number) {
  const room = await roomRepository.findRoomById(roomId);
  const bookings = await bookingRepository.findBookingByRoomId(roomId);

  if (!room) throw notFoundError();

  if (room.capacity <= bookings.length) throw cannotBookingError();
}

async function bookingRoomById(userId: number, roomId: number) {
  await checkEnrollmentTicket(userId);
  await checkValidBooking(roomId);

  return bookingRepository.create({ roomId, userId });
}

async function updateBookingRoomById(userId: number, roomId: number) {
  await checkValidBooking(roomId);
  const booking = await bookingRepository.findBookingByUserId(userId);

  if (!booking || booking.userId !== userId) throw cannotBookingError();

  return bookingRepository.upsertBooking({
    id: booking.id,
    roomId,
    userId,
  });
}

const bookingService = {
  bookingRoomById,
  getBooking,
  updateBookingRoomById,
};

export default bookingService;
