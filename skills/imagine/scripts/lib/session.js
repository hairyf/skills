import fs from "node:fs";
import path from "node:path";

// Session state directory; override with IMAGINE_SESSION_DIR.
const SESSION_DIR = process.env.IMAGINE_SESSION_DIR || ".imagine";

/**
 * Resolve the state file path for a session name.
 * Names are restricted to letters/digits/-/_ to avoid path traversal.
 */
export function sessionPath(name) {
  if (!/^[A-Za-z0-9_-]+$/.test(name)) {
    throw new Error(`Invalid session name "${name}": use letters, digits, "-" or "_".`);
  }
  return path.resolve(SESSION_DIR, `${name}.json`);
}

/**
 * Load a session state, or null when missing/corrupted.
 */
export function loadSession(name) {
  const file = sessionPath(name);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return null;
  }
}

/**
 * Persist session state, creating the directory as needed.
 */
export function saveSession(name, state) {
  const file = sessionPath(name);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(state, null, 2));
  return file;
}

/**
 * Return the most recent generated image path in the session history.
 */
export function latestImage(state) {
  if (!state?.turns) return "";
  for (let i = state.turns.length - 1; i >= 0; i--) {
    const images = state.turns[i]?.images || [];
    if (images.length) return images[images.length - 1];
  }
  return "";
}

/**
 * Guess a MIME type from a local image path.
 */
export function mimeOf(filePath) {
  const ext = path.extname(filePath).toLowerCase().replace(".", "");
  return `image/${ext === "jpg" ? "jpeg" : ext || "png"}`;
}
