import { exec } from "node:child_process";
export function checkPosgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);
  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPosgres();
      return;
    }

    console.log("\n🟢 Postgres is ready and accepting connections!\n");
  }
}

process.stdout.write("\n🔵 Waiting Postgres accepting connections");
