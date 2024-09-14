import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { provideAccess } from './component/provideAccess.js';

const app = express();
const port = 5000;

app.use(morgan('combined'));
app.use(bodyParser.json({limit: '2mb', type: 'application/json'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
    res.send('Live');
});

app.get('/provideAccess', async (req, res) => {
    const transactionHash = req.params.transactionHash;
    const signature = req.params.signature;
    console.log(transactionHash);
    console.log(signature);
    const connectionString = await provideAccess(transactionHash, signature);
    res.send(connectionString);
});

export const startServer = () => {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}
