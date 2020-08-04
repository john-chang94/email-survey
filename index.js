const express = require('express');
const app = express();
const mongoose = require('mongoose');
const keys = require('./config/keys');
require('./models/User'); // Placed before passport because passport function looks for a mongoose model inside it
require('./services/passport'); // Shortened because there is no var assigned in this file

mongoose.connect(keys.MONGO_URI);

require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT)