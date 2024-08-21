import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import {getAllVPNProviders} from './accessors/ddbAccessor.js';

const app = express();
const port = 3000;

app.use(morgan('combined'));
app.use(bodyParser.json({limit: '2mb', type: 'application/json'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/getListings', (req, res) => {
    getAllVPNProviders().then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(504).send("ERROR");
    })
});

export const startServer = () => {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}
