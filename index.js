const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_TOKEN = process.env.PRIVATE_APP_TOKEN;
const OBJECT_TYPE_ID = '2-226938741';

// ROUTE 1: Homepage - GET all Luffy Characters records
app.get('/', async (req, res) => {
    try {
        const response = await axios.get(
            `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE_ID}?properties=name,bounty,devil_fruit,crew`,
            {
                headers: {
                    Authorization: `Bearer ${PRIVATE_APP_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        const characters = response.data.results;
        res.render('homepage', {
            title: 'Luffy Characters | HubSpot Practicum',
            characters: characters
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data from HubSpot API');
    }
});

// ROUTE 2: GET form to create a new Luffy Character record
app.get('/update-cobj', (req, res) => {
    res.render('updates', {
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    });
});

// ROUTE 3: POST form data to create a new Luffy Character record
app.post('/update-cobj', async (req, res) => {
    try {
        const { name, bounty, devil_fruit, crew } = req.body;
        await axios.post(
            `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE_ID}`,
            {
                properties: {
                    name: name,
                    bounty: bounty,
                    devil_fruit: devil_fruit,
                    crew: crew
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${PRIVATE_APP_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating record in HubSpot API');
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
