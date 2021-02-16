require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../public')));

app.get('/rovers', async (req, res) => {
    try {
        const data = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=${process.env.API_KEY}`);
        let rovers = await data.json();
        rovers = rovers.rovers.map(rover => {
            return {
                name: rover.name,
                landing_date: rover.landing_date,
                launch_date: rover.launch_date,
                status: rover.status
            }
        });
        console.log(rovers);
        res.send(rovers);
    } catch (error) {
        console.error(error);
    }
})

app.get('/rovers/:name', async (req, res) => {
    const roverName = req.params.name;
    try {
        const result = await fetch(
            `https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}/latest_photos?api_key=${process.env.API_KEY}`
        );
        const data = await result.json();
        res.send(data);
    } catch (error) {
        console.error(error);
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));