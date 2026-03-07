import { Client } from "pg";

async function query(queryParams) {
  const client = new Client(buildClientConfig());

  try {
    await client.connect();
    const result = await client.query(queryParams);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
}

function buildClientConfig() {
  const result = {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    ssl: false,
  };
  if (process.env.NODE_ENV === "development") return result;

  const ca = Buffer.from(process.env.POSTGRES_CA, "base64").toString("utf8");
  result.ssl = { ca, rejectUnauthorized: true };

  return result;
}

export default {
  query: query,
};
