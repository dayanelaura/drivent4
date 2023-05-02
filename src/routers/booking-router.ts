import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { listBooking, bookingRoom, updateBooking } from '@/controllers';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', listBooking)
  .post('/', bookingRoom)
  .put('/:bookingId', updateBooking);

export { bookingRouter };
