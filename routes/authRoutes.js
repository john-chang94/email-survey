const passport = require('passport');

module.exports = (app) => {
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

    // Passport will handle the authentication process once directed to this callback url
    app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
        res.redirect('/surveys');
    });

    app.get('/api/logout', (req, res) => {
        req.logout(); // Logout is attached to passport
        res.redirect('/');

    })

    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    })
}
