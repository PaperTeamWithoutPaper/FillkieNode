import express, {NextFunction, Request, Response} from 'express';
import mongoose from 'mongoose';
import process from 'process';
import dotenv from 'dotenv';
import app from './app';

/**
 * start app
 * @return {Promise<void>} resolves when started
 */
async function startApp(): Promise<void> {
    dotenv.config();

    const mongoURI = process.env.MONGO_CONNECTION_URI || 'mongodb://localhost:27017/test';
    await mongoose.connect(mongoURI);

    const port = Number(process.env.PORT || 8080);
    app.listen(port, () => {
        console.log(`App started on port ${port}`);
    });
}

startApp()
    .catch((error) => {
        console.error(error);
    });
