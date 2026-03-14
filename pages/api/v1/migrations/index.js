import { runner } from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";
export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();
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
    await dbClient.end();
    return response.status(200).json(pendingMigrations);
  }
  if (request.method === "POST") {
    const appliedMigrations = await runner({
      ...defaultMigrationOptions,
      dryRun: false,
    });
    await dbClient.end();

    if (appliedMigrations.length > 0) {
      return response.status(201).json(appliedMigrations);
    }
    return response.status(200).json(appliedMigrations);
  }

  response.status(405).end();
}
