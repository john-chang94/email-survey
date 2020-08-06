module.exports = (req, res, next) => {
    if (!req.user) { // user comes from passport.session in every req, user model is passed in passport.js
        return res.status(401).send({ error: 'You must log in!' })
    }
    next();
}