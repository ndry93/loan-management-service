import { DataSource } from 'typeorm';
import { OrmConfig } from './ormconfig';

// eslint-disable-next-line import/no-default-export
export default new DataSource(OrmConfig);
