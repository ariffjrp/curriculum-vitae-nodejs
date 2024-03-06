const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
const db = require('../models');
const { json } = require('sequelize');
const { Account, User } = db;
const { logger } = require('../utils/logger');
const { log } = require('winston');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:8000/login/oauth2/code/google"
},
async function(accessToken, refreshToken, profile, cb) {
  logger.info("Google Profile Data:", profile); 

  const email = profile._json.email;
  logger.info("Email:", email);
  try {
    let user = await User.findOne({ where: { email: email } });
    if (!user) {
      try {
        user = await User.create({
          email: email,
          provider: profile.provider,
        });

        await Account.create({
          name: profile._json.name,
          avatar: profile._json.picture,
          userId: user.id,
        })
        logger.info("user baru", user);
      } catch (error) {
        logger.error("Error creating user:", error);
      }
    } 
    return cb(null, user);
  } catch (err) {
    return cb(err, null);
  }
}
));



passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
