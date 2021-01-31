require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3001

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls

app.get('/rovers', async (req, res) => {
    try {
        const data = await fetch('https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=g32scjwwWzUmWGQJwblAeqbydGTU6uU1kBJ1IXG5');
        const rovers = await data.json();
        res.send(rovers);
        console.log(rovers);
    } catch (error) {
        console.error(error);
    }
})

// example API call
app.get('/apod', async (req, res) => {
    try {
        let image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ image })
    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))