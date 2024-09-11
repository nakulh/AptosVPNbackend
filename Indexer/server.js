import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import {getAllVPNProviders, updateVPNProviderHealth} from './accessors/ddbAccessor.js';

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
    // Used by user client nodes to retrieve list of all available VPN providers
    getAllVPNProviders().then(data => {
        res.status(200).json(data.Items);
    }).catch(err => {
        res.status(504).send("ERROR");
    })
});

app.get('/updateMinerHealth', (req, res) => {
    // ToDo: Logic needs to have signature validation so only approved governance nodes are allowed
    const minerObjId = req.minerObjectId;
    const faultCount = req.faultCount;
    updateVPNProviderHealth(minerObjId, faultCount).then(data => {
        res.status(200).send("ACK");
    }).catch(err => {
        res.status(504).send("ERROR");
    });
})

export const startServer = () => {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}
