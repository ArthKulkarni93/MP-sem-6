const express = require('express');
const cors = require('cors');
const env = require('dotenv');
const authrouter = require('./api/controllers/auth');

env.config();
const port = process.env.port

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json({
        msg: `hi there from ${port}`
    })
})

app.use('/api/v1/auth', authrouter);
app.listen(3000, () => {
    console.log('running on 3000')
})
