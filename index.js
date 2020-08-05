const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
require('./models/User'); // Placed before passport because passport function looks for a mongoose model inside it
require('./services/passport'); // Shortened because there is no var assigned in this file

mongoose.connect(keys.MONGO_URI);

app.use(cookieSession({
    maxAge: 30*24*60*60*1000, // 30 days
    keys: [keys.COOKIE_KEY]
}))

// Tell passport to make use of cookies for authentication
// Cookie references a session, a session can hold arbitrary amounts of info
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT)