import mongoose from 'mongoose';

// DB CONFIGS
const dbHost = 'YOUR DB HOST';
const dbUserName = 'YOUR DB USER NAME';
const dbPassword = 'YOUR DB PASSWORD';
const dbName ='YOUR DB NAME';
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