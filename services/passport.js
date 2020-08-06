const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

// Take user model and put identifying information into a cookie
passport.serializeUser((user, done) => {
    done(null, user.id);
})

// Pull cookie back out and turn back into a user
passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        })
})

passport.use(new GoogleStrategy({
    clientID: keys.GOOGLE_CLIENT_ID,
    clientSecret: keys.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback', // Route to send user after authentication
    proxy: true
}, async (accessToken, refreshToken, profile, done) => { // Callback returns accessToken, refreshToken, and profile
    const existingUser = await User.findOne({ googleId: profile.id })
    if (existingUser) {
        // (No error, user record)
        // Tells passport everything is fine and done
        return done(null, existingUser);
    }
    const user = await new User({ googleId: profile.id }).save()
    done(null, user);
}));