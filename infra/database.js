import { Client } from "pg";

async function query(queryParams) {
  let client;

  try {
    client = await getNewClient();
    const result = await client.query(queryParams);

    return result;
  } catch (error) {
    console.error(error);

    throw error;
  } finally {
    await client.end();
  }
}

async function getNewClient() {
  const client = new Client(buildClientConfig());
  await client.connect();
  return client;
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
  if (process.env.NODE_ENV !== "production") return result;

  const SSLCACertificate = process.env.POSTGRES_CA;
  if (SSLCACertificate) {
    result.ssl = { ca: SSLCACertificate, rejectUnauthorized: true };
  } else {
    result.ssl = true;
  }

  return result;
}

export default {
  query,
  getNewClient,
};
