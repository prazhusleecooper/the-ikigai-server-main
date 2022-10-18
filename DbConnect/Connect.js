import mongoose from 'mongoose';

// DB CONFIGS
const dbHost = "ikigai.u2vbktk.mongodb.net";
const dbUserName = 'root';
const dbPassword = 'root';
const dbName ='ikigai-db';
const mongoUrl =
	'mongodb+srv://' +
	dbUserName +
	':' +
	dbPassword +
	'@' +
	dbHost +
	'/' +
	dbName +
	'?' +
	'retryWrites=true&w=majority';

export const connectDB = async () => {

    try {

        await mongoose.connect(mongoUrl);

        console.log({
            type: 'SUCCESS',
            message: 'DB CONNECTION SUCCESSFUL'
        })

        return;

    } catch (error) {

        console.log({
            type: 'ERROR',
            messatge: 'DB CONNECT ERROR',
            error: error,
        });

        return;

    }

};