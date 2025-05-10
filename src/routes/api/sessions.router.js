import { Router } from 'express';
import { register, login, current, logout } from '../../controllers/auth.controller.js';
import passport from '../../middlewares/passport-jwt.middleware.js';
import { sendPasswordResetEmail, resetPassword  } from '../../controllers/auth.controller.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/current', (req, res, next) =>
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({
          error: 'Acceso denegado',
          message: 'Token inválido o no proporcionado'
        });
      }
      req.user = user; 
      next();
    })(req, res, next),
    current
  );
  
router.post('/logout', logout);


router.post('/password-recovery', sendPasswordResetEmail);
router.put('/reset-password', resetPassword);




export default router;
