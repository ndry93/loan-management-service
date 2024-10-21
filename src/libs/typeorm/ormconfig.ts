import { DataSourceOptions } from 'typeorm';
import { migrations } from 'src/libs/typeorm/migrations';
import * as ENTITIES from 'src/models';
import * as SUBSCRIBERS from 'src/models/subscribers';

import {
    // Envvars for default database connection
    PGHOST,
    PGPORT,
    PGUSER,
    PGPASSWORD,
    PGDATABASE,

    // Envvars for read replica database connection
    PGROHOST,
    PGROPORT,
    PGROUSER,
    PGROPASSWORD,
    IS_LOCAL,
    IS_TEST
} from 'src/config';

export const OrmConfig: DataSourceOptions = {
    // synchronize: !IS_PRODUCTION, // npm run migration:generate -- <MigrationName>
    logging: IS_LOCAL || IS_TEST,
    entities: ENTITIES,
    migrations,
    migrationsRun: IS_TEST, // to be enabled on test env
    cache: true, // https://typeorm.io/#/caching
    subscribers: SUBSCRIBERS,

    // Will be overwritten by env vars refer .env.example
    type: 'postgres',
    installExtensions: IS_LOCAL || IS_TEST,
    extra: {
        // db.getClient wait time on a full pool connection before timing out
        connectionTimeoutMillis: 10000,

        // time before the pool releases the client and db.getClient has to reconnect
        idleTimeoutMillis: 60000,

        // time to consider query is taking too long
        statement_timeout: 360000, // 6 minutes

        // Increase the default pool of 10 connections for node-pg
        // https://github.com/typeorm/typeorm/blob/master/docs/connection-options.md#common-connection-options
        // https://node-postgres.com/api/pool
        // Rough guideline on what is the right max number
        // max = (max_connection / instance_count) - instance_count
        // eg 103 = (4000 / 30) - 30
        // -- max_connection = https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Managing.Performance.html
        // -- instance_count = number of connected instance inclusive of queue runners & crons for the whole cluster
        max: 10
    },
    replication: {
        // read-write connection
        master: {
            database: PGDATABASE,
            host: PGHOST,
            port: PGPORT,
            username: PGUSER,
            password: PGPASSWORD
        },
        slaves: [
            {
                database: PGDATABASE,
                host: PGROHOST,
                port: PGROPORT,
                username: PGROUSER,
                password: PGROPASSWORD
            }
        ]
        // read-only connection
    }
};
