import postgres from 'postgres';

const connectionString = "postgres://postgres.paixptuglhwecgkdjfwm:CumminsTLA_Pass@aws-0-us-east-1.pooler.supabase.com:5432/postgres";
const sql = postgres(connectionString);

export default sql;