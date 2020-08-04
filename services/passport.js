const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.use(new GoogleStrategy({
    clientID: keys.GOOGLE_CLIENT_ID,
    clientSecret: keys.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback' // Route to send user after authentication
}, (accessToken, refreshToken, profile, done) => { // Callback returns accessToken, refreshToken, and profile
    new User({ googleId: profile.id }).save();
}));