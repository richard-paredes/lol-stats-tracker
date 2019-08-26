// SERVER DEPENDENCIES
const express   = require('express'),
    morgan      = require('morgan'),
    cors        = require('cors'),
    app         = express();
    require('dotenv').config({ path: './.env' });

// ROUTES
const profilesRoute = require('./routes/profiles');

// Development environment setup
const PORT = process.env.PORT || 8000;
app.use(cors());

// Dev logging: tracks the HTTP requests
if (process.env.NODE_ENV === 'development')
{
    app.use(morgan('dev'));
}

// ROOT
app.get('/', (req, res) => {
    res.send('<h1>Hello</h1>')
});

app.use('/api/v1/profile', profilesRoute);

// initializing server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}, running in ${process.env.NODE_ENV} mode.`);
});