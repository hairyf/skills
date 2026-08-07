import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// scripts/lib/ -> scripts/
const scriptDir = path.resolve(__dirname, "..");

/**
 * Lightweight .env parser (replaces the dotenv dependency)
 */
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const delimiterIdx = trimmed.indexOf("=");
      if (delimiterIdx === -1) continue;

      const key = trimmed.slice(0, delimiterIdx).trim();
      let value = trimmed.slice(delimiterIdx + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch {
    // Ignore read or parse failures
  }
}

/**
 * Load .env from the current working directory and the script directory.
 */
export function loadEnv() {
  loadEnvFile(path.resolve(process.cwd(), ".env"));
  loadEnvFile(path.resolve(scriptDir, ".env"));
}
