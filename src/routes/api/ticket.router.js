import { Router } from 'express';
import passport from '../../middlewares/passport-jwt.middleware.js';
import { checkRole } from '../../middlewares/checkRole.js';
import { generateTicket } from '../../controllers/ticket.controller.js';

const router = Router();

router.post('/:cid/purchase',
  passport.authenticate('jwt', { session: false }),
  checkRole('user'),
  generateTicket
);

export default router;