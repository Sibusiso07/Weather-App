import express from 'express';
import axios from 'axios';
import cors from 'cors';
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';

const app = express();
const port = 3001;

dotenv.config();
app.use(cors());
app.use(bodyParser.json());

const API_URL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"
const API_KEY = "?unitGroup=metric&key=" + process.env.API_KEY;


app.post("/", async (req, res) => {
    try {
        const { lat, lon } = req.body;
        let location = null;
        if (lat && lon) {
            location = `${lat},${lon}`;
        } else {
            location = "Witbank";
        }
        // console.log(location);
        const response = await axios.get(API_URL + location + API_KEY);
        res.json(response.data); 
    } catch (error) {
        console.error("Failed to connect to API: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.listen(port, () => {
    console.log("Server listening on port: " + port);
})