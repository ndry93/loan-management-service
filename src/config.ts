/* eslint no-process-env: "off" */
// NOTE: All env vars from process.env are imported as STRINGS. It is important to keep this in mind and cast your env vars as needed.

export const { NODE_ENV, APP_ENV } = process.env;

export const SERVICE_NAME = process.env.SERVICE_NAME || 'loan-management-service';
export const PORT = process.env.PORT || '3000';

export const IS_PRODUCTION = NODE_ENV === 'production';
export const IS_LOCAL = NODE_ENV === 'local';
export const IS_TEST = NODE_ENV === 'test';
export const IS_DEV = NODE_ENV === 'development';

// Env mode
export const IS_PRODUCTION_APPENV = APP_ENV === 'production';
export const IS_STAGING_APPENV = APP_ENV === 'staging';
export const IS_LOCAL_APPENV = APP_ENV === 'local';

// Envvars for default database connection
export const PGDATABASE = process.env.PGDATABASE || 'test';
export const PGHOST = process.env.PGHOST || 'localhost';
export const PGPORT = Number(process.env.PGPORT) || 54320;
export const PGUSER = process.env.PGUSER || 'test';
export const PGPASSWORD = process.env.PGPASSWORD || 'test';

// Envvars for read replica database connection; defaults to default db connection
export const PGROHOST = process.env.PGROHOST || PGHOST;
export const PGROPORT = Number(process.env.PGROPORT) || PGPORT;
export const PGROUSER = process.env.PGROUSER || PGUSER;
export const PGROPASSWORD = process.env.PGROPASSWORD || PGPASSWORD;
