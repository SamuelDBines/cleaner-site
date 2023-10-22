import postgres from 'postgres';
const sql = postgres('postgresql://postgres:postgres@localhost:5432/digiyou'); // will use psql environment variables

export default sql;