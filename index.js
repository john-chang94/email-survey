const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
require('./models/User'); // Placed before passport because passport function looks for a mongoose model inside it
require('./models/Survey');
require('./services/passport'); // Shortened because there is no var assigned in this file

mongoose.connect(keys.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Database connected'));

app.use(express.json());
app.use(cookieSession({
    maxAge: 30*24*60*60*1000, // 30 days
    keys: [keys.COOKIE_KEY]
}))

// Tell passport to make use of cookies for authentication
// Cookie references a session, a session can hold arbitrary amounts of info
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);
require('./routes/surveyRoutes')(app);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))