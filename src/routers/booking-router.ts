import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { listBooking } from '@/controllers';

const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken).get('/', listBooking);

export { bookingRouter };
