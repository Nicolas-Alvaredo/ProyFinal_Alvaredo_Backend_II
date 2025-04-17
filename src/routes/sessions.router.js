import { Router } from 'express';
import { register, login, current, logout } from '../controllers/auth.controller.js';
import passport from '../middlewares/passport-jwt.middleware.js'

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/current', passport.authenticate('jwt', { session: false }), current);
router.post('/logout', logout);


export default router;
