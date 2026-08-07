import path from "node:path";

import { EXT_BY_FORMAT } from "./config.js";

/**
 * Resolve the final output path for one generated audio file.
 */
export function resolveAudioPath(opts, ext) {
  const finalExt = opts.format ? EXT_BY_FORMAT[opts.format] || ext : ext;

  if (!opts.output) {
    return path.resolve(`audio-${Date.now()}.${finalExt}`);
  }

  const output = path.resolve(opts.output);
  if (path.extname(output)) return output;
  return path.join(output, `audio-${Date.now()}.${finalExt}`);
}
