import { runner } from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";
export default async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(request.method)) {
    return response
      .status(405)
      .json({ error: `Method ${request.method} not allowed` });
  }

  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const defaultMigrationOptions = {
      dbClient,
      dryRun: true,
      dir: resolve("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (request.method === "GET") {
      const pendingMigrations = await runner(defaultMigrationOptions);
      return response.status(200).json(pendingMigrations);
    }
    if (request.method === "POST") {
      const appliedMigrations = await runner({
        ...defaultMigrationOptions,
        dryRun: false,
      });

      if (appliedMigrations.length > 0) {
        return response.status(201).json(appliedMigrations);
      }

      return response.status(200).json(appliedMigrations);
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
