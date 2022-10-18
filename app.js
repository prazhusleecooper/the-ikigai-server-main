import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { connectDB } from './DbConnect/Connect.js';
import router from './routes.js';

export const startServer = async () => {

    const app = express();

    const port = 5000;

    await connectDB();

    app.use(cors());

    app.use(bodyParser.urlencoded({ extended: false }))

    app.use(bodyParser.json())

    app.use('/api', router);

    app.listen(port, () =>{

        console.log({
            type: 'SUCCESS',
            message: 'SERVER INITALIZATION SUCCESSFUL'
        })

    });

};