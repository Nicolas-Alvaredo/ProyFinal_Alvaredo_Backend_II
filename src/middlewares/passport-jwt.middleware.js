import dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../daos/mongodb/models/user-model.js';

const SECRET = process.env.JWT_SECRET;

const cookieExtractor = req => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.token;
  }
  return token;
};

const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    cookieExtractor
  ]),
  secretOrKey: SECRET
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.user.id);
      if (!user) return done(null, false);
      return done(null, user); // se setea como req.user
    } catch (err) {
      return done(err, false);
    }
  })
);

export default passport;
