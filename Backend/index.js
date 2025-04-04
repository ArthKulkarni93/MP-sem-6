const express = require('express');
const cors = require('cors');
const env = require('dotenv');
const authrouter = require('./api/controllers/auth');

env.config();
const port = process.env.PORT

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json({
        msg: `hi there from ${port}`
    })
})

app.use('/api/v1/auth', authrouter);

app.listen(port, () => {
    console.log(`running on ${port}`)
})

