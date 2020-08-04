const passport = require('passport');

module.exports = (app) => {
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

    // Passport will handle the authentication process once directed to this callback url
    app.get('/auth/google/callback', passport.authenticate('google'));
}
