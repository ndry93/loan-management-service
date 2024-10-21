import pino from 'pino';

const loggerOptions = {
    level: 'error'
};

export const logger = pino(loggerOptions);
