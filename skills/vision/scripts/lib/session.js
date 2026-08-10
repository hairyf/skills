/**
 * Session state management for vision conversations.
 * Mirrors the imagine skill's session design: state is persisted as JSON in
 * .vision/<name>.json (or VISION_SESSION_DIR) and replayed on the next call
 * with the same --session name.
 */

import fs from "node:fs";
import path from "node:path";

import { detectMime } from "./image.js";

// Session state directory; override with VISION_SESSION_DIR.
const SESSION_DIR = process.env.VISION_SESSION_DIR || ".vision";

const NAME_RE = /^[A-Za-z0-9_-]+$/;

/**
 * Validate a session name (letters/digits/-/_) to avoid path traversal.
 */
export function isValidSessionName(name) {
  return NAME_RE.test(name);
}

/**
 * Resolve the state file path for a session name.
 */
export function sessionPath(name) {
  if (!isValidSessionName(name)) {
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
 * Keep only the most recent N turns for replay (default 10, override with
 * VISION_SESSION_MAX_TURNS). Image-heavy histories are trimmed so replays do
 * not overflow the model's context window; stored turns are never deleted.
 */
export function trimTurns(turns, maxTurns) {
  const cap = Number.isFinite(maxTurns) && maxTurns > 0 ? maxTurns : 10;
  if (!Array.isArray(turns) || turns.length <= cap) return turns || [];
  return turns.slice(turns.length - cap);
}

/**
 * Convert a stored image source into an API-ready image URL/data URL:
 *   - data: URLs (stored base64 input) pass through as-is;
 *   - http(s) URLs pass through as-is (the API fetches them);
 *   - local paths are read at replay time; missing files return null so the
 *     turn degrades to text-only instead of failing.
 */
export function imageUrlFor(source) {
  const s = String(source || "");
  if (!s) return null;
  if (/^data:image\//i.test(s)) return s;
  if (/^https?:\/\//i.test(s)) return s;
  try {
    const file = path.resolve(s);
    if (!fs.existsSync(file)) return null;
    const buf = fs.readFileSync(file);
    return `data:${detectMime(buf)};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}
