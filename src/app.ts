import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import logger from './api/utils/logger';
import Controller from './api/interfaces/controller.interface';
import DBConnection from './api/utils/DBConnection';

class App {
    public express: Application
    public port: number

    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;

        this.enableExpressMiddlewares();
        this.enableExpressControllers(controllers);
        DBConnection.connectDB();
    }

    private enableExpressMiddlewares() : void {
        this.express.use(cors({
            origin: process.env.SERVER_IP
        }))
        this.express.use(express.json({ limit: '50mb' }));
        this.express.use(bodyParser.json({ limit: '50mb' }))
        this.express.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
    }

    private enableExpressControllers(controllers: Controller[]) : void {
        controllers.forEach((controller: Controller) => {
            this.express.use('/api/v1', controller.router)
        });
    }
    
    public listen() : any {
        return this.express.listen(this.port, () => {
            logger.info(`Product API is running on http://localhost:${this.port}`)
        })
    }
}

export default App;