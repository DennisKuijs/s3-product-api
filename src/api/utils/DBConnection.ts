import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import logger from '../utils/logger'

let mockDB : any = null;

async function connectDB() : Promise<void> {
    try {

        let dbUri : string = process.env.MONGOOSE_CONNECTIONSTRING ?? ''

        if (process.env.NODE_ENV === 'test') {
            mockDB = await MongoMemoryServer.create();
            dbUri = mockDB.getUri();
        }

        const connection = await mongoose.connect(dbUri)
        logger.info(`MongoDB Connected: ${connection.connection.host}`)
    }
    catch (error) {
        logger.error(error)
    }
}

async function disconnectDB() : Promise<void> {
    try {
        
        await mongoose.connection.close();

        if(mockDB) {
            await mockDB.stop();
        }

    }
    catch (error) {
        logger.error(error)
    }
}

export default { connectDB, disconnectDB }