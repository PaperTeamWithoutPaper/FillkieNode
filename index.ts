import mongoose from 'mongoose';
import process from 'process';
import dotenv from 'dotenv';

/**
 * start app
 * @return {Promise<void>} resolves when started
 */
async function startApp(): Promise<void> {
    dotenv.config();

    const mongoURI = process.env.MONGO_CONNECTION_URI || 'mongodb://localhost:27017/test';
    const port = Number(process.env.PORT || 8080);
    await mongoose.connect(mongoURI);
}

void startApp();
