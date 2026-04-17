import nextJest from "next/jest.js";
import { config } from "dotenv";
import path from "node:path";

const dir = path.resolve(process.cwd(), ".env.development");
config({ path: dir });

const createJestConfig = nextJest({
  dir: ".",
});
const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
  testTimeout: 60000,
  setupFilesAfterEnv: ["./jest.setup.js"],
});

export default jestConfig;
