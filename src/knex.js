import knex from 'knex';
import {development, production} from '../knexfile';

const db = knex(process.env.NODE_ENV === 'production' ? production : development);
export default db;
