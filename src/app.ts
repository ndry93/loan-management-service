import bodyParser from 'body-parser';
import compression from 'compression';
import express, { Application, RequestHandler } from 'express';
import httpContext from 'express-http-context';
import helmet from 'helmet';

import { PORT } from 'src/config';
import { logger } from 'src/libs/logger';

import { init } from 'src/init';
import { DataSource } from 'typeorm';
import { errorHandler } from './middlewares/error-handler.middleware';

type CreateAppType = {
    app: express.Application;
    dataSource: DataSource;
};

/**
 * Setup the application routes with controllers
 * @param app
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function setupRoutes(app: Application, initOptions: any) {
    const { loanController, healthcheckController } = initOptions;

    // v1 endpoints
    const v1 = '/api/v1';
    app.use(`${v1}/loans`, loanController.getRouter());
    app.use(`/healthcheck`, healthcheckController.getRouter());
}

/**
 * Main function to setup Express application here
 */
export async function createApp(): Promise<CreateAppType> {
    const app = express();
    app.set('port', PORT);
    app.use(helmet() as RequestHandler);
    app.use(compression());
    app.use(bodyParser.json({ limit: '100mb', type: 'application/json' }) as RequestHandler);
    app.use(bodyParser.urlencoded({ extended: true }) as RequestHandler);
    app.use((req, res, next) => {
        logger.info('Example logging request', { url: req.url });
        return next();
    }); // Needs to be after bodyParser

    const initOptions = await init();

    // This should be last, right before routes are installed
    // so we can have access to context of all previously installed
    // middlewares inside our routes to be logged
    app.use(httpContext.middleware);

    await setupRoutes(app, initOptions);

    // Transform all responses to have the same format

    // In order for errors from async controller methods to be thrown here,
    // you need to catch the errors in the controller and use `next(err)`.
    // See https://expressjs.com/en/guide/error-handling.html
    app.use(errorHandler());

    return {
        app,
        dataSource: initOptions.dataSource
    };
}
