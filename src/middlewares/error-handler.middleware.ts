import { NextFunction, Request, Response } from 'express';
import { ErrorCodes } from 'src/errors';
import { logger } from 'src/libs/logger';

export interface ValidationErrorItem {
    path: string;
    message: string;
    error_code?: string;
}

export interface ValidationError {
    message?: string;
    status: number;
    errors: ValidationErrorItem[];
}

export const errorHandler = () => {
    // This is an express error handler, need to the 4 variable signature
    // eslint-disable-next-line
    return (err: any, req: Request, res: Response, next: NextFunction) => {
        if ((err as ValidationError).status) {
            logger.info({ err }, 'Validation Error');
            return res.status(err.status).json({
                message: err.message,
                error_code: err.error_code || ErrorCodes.API_VALIDATION_ERROR,
                // only exposed Xendit-API-standard compliant fields //
                errors: err.errors
                    ? err.errors.map((e: { path: string; message: string; doc_url?: string }) => ({
                          path: e.path, // eslint-disable-line
                          message: e.message, // eslint-disable-line @typescript-eslint/indent
                          doc_url: e.doc_url // eslint-disable-line @typescript-eslint/indent
                      })) // eslint-disable-line @typescript-eslint/indent
                    : err.errors
            });
        }

        logger.error(err, 'unexpected error');

        // publish unexpected errors to Sentry here

        return res.status(500).send({
            error_code: 'SERVER_ERROR',
            message: 'Something unexpected happened, we are investigating this issue right now'
        });
    };
};
