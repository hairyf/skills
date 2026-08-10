#!/usr/bin/env node
/**
 * Install the resampling dependency (sharp) used by --coords debug mode.
 * Packages are installed into scripts/.deps/ (gitignored), so the main
 * vision.js stays dependency-free for non-debug calls.
 *
 * Usage:
 *   node lib/install.js            # install if missing, then print the module dir
 *   node lib/install.js --force    # reinstall even if present
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEPS_DIR = path.join(__dirname, ".deps");
const PKG = "sharp";

function isInstalled() {
  return fs.existsSync(path.join(DEPS_DIR, "node_modules", PKG));
}

function main() {
  const force = process.argv.includes("--force");
  if (isInstalled() && !force) {
    console.log(path.join(DEPS_DIR, "node_modules"));
    return;
  }

  fs.mkdirSync(DEPS_DIR, { recursive: true });
  const pkgPath = path.join(DEPS_DIR, "package.json");
  if (!fs.existsSync(pkgPath)) {
    fs.writeFileSync(pkgPath, JSON.stringify({ name: "vision-deps", private: true }, null, 2));
  }

  console.error(`Installing ${PKG} into ${DEPS_DIR} (one-time download)...`);
  execSync(`npm install ${PKG} --no-audit --no-fund --silent --loglevel=error`, {
    cwd: DEPS_DIR,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (!isInstalled()) {
    console.error("Install failed. Check your network/npm, then retry: node scripts/lib/install.js");
    process.exit(1);
  }
  console.log(path.join(DEPS_DIR, "node_modules"));
}

main();
