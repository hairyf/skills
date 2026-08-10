/**
 * Coordinate parsing/normalization and view-to-original pixel mapping.
 * Shared by vision.js (locate rounds) and vision-preprocess.js (remap mode).
 */

/**
 * Parse one coordinate line, tolerating malformed JSON (missing keys, stray
 * commas, arrays instead of objects). Prefers a center point; falls back to
 * computing the center from a bbox. Returns a canonical element or null.
 */
export function parseCoordinateLine(line) {
  // Strict JSON first
  try {
    const obj = JSON.parse(line.replace(/,\s*$/, ""));
    const name = String(obj.name ?? "");
    const text = String(obj.text ?? "");
    const b = obj?.bbox;
    const bx = Number(b?.x);
    const by = Number(b?.y);
    const bw = Number(b?.w);
    const bh = Number(b?.h);
    if ([bx, by, bw, bh].every((n) => Number.isFinite(n))) {
      return {
        name,
        text,
        bbox: { x: Math.round(bx), y: Math.round(by), w: Math.round(bw), h: Math.round(bh) },
        center: { x: Math.round(bx + bw / 2), y: Math.round(by + bh / 2) },
      };
    }
    const c = obj?.center;
    if (c && Number.isFinite(Number(c.x)) && Number.isFinite(Number(c.y))) {
      return { name, text, center: { x: Math.round(Number(c.x)), y: Math.round(Number(c.y)) } };
    }
  } catch {
    // Fall through to tolerant parsing
  }

  const name = /["']name["']\s*:\s*"([^"]*)"/i.exec(line)?.[1] ?? "";
  const text = /["']text["']\s*:\s*"([^"]*)"/i.exec(line)?.[1] ?? "";

  // Tolerant fallback: numbers following "center" or "bbox" markers
  const numsAfter = (marker) => {
    const idx = line.toLowerCase().indexOf(marker);
    const tail = idx === -1 ? line : line.slice(idx);
    return [...tail.matchAll(/-?\d+(?:\.\d+)?/g)].map((m) => Number(m[0]));
  };
  const bboxNums = numsAfter("bbox");
  if (bboxNums.length >= 4) {
    return {
      name,
      text,
      bbox: {
        x: Math.round(bboxNums[0]),
        y: Math.round(bboxNums[1]),
        w: Math.round(bboxNums[2]),
        h: Math.round(bboxNums[3]),
      },
      center: {
        x: Math.round(bboxNums[0] + bboxNums[2] / 2),
        y: Math.round(bboxNums[1] + bboxNums[3] / 2),
      },
    };
  }
  const centerNums = numsAfter("center");
  if (centerNums.length >= 2) {
    return { name, text, center: { x: Math.round(centerNums[0]), y: Math.round(centerNums[1]) } };
  }
  const allNums = [...line.matchAll(/-?\d+(?:\.\d+)?/g)].map((m) => Number(m[0]));
  if (allNums.length >= 2) {
    return { name, text, center: { x: Math.round(allNums[0]), y: Math.round(allNums[1]) } };
  }
  return null;
}

/**
 * Serialize an element in the requested format ("bbox" or "center").
 * Falls back to deriving the missing representation when only one is known.
 */
export function formatElement(el, format) {
  const out = { name: el.name, text: el.text };
  if (format === "center") {
    const c =
      el.center ||
      (el.bbox
        ? {
            x: Math.round(el.bbox.x + el.bbox.w / 2),
            y: Math.round(el.bbox.y + el.bbox.h / 2),
          }
        : null);
    if (c) out.center = c;
  } else {
    const b =
      el.bbox || (el.center ? { x: el.center.x, y: el.center.y, w: 1, h: 1 } : null);
    if (b) out.bbox = b;
  }
  return out;
}

/**
 * Scale an element's bbox and center from the resampled view back to the
 * ORIGINAL image pixels (accounting for the crop offset).
 */
export function scaleElement(el, meta) {
  const sx = meta.cropW / meta.scaledW;
  const sy = meta.cropH / meta.scaledH;
  const out = { name: el.name, text: el.text };
  if (el.center) {
    out.center = {
      x: Math.round(meta.cropX + el.center.x * sx),
      y: Math.round(meta.cropY + el.center.y * sy),
    };
  }
  if (el.bbox) {
    out.bbox = {
      x: Math.round(meta.cropX + el.bbox.x * sx),
      y: Math.round(meta.cropY + el.bbox.y * sy),
      w: Math.round(el.bbox.w * sx),
      h: Math.round(el.bbox.h * sy),
    };
  }
  return out;
}

export function normalizeCoordinates(output, format = "bbox") {
  const lines = output.split(/\r?\n/);
  const idx = lines.findIndex((l) => /^##\s*Coordinates/i.test(l.trim()));
  if (idx === -1) return output;

  const elements = [];
  for (let i = idx + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (/^#{1,3}\s/.test(line) || /^[-*]\s/.test(line)) continue;
    const el = parseCoordinateLine(line);
    if (el) elements.push(el);
  }
  if (elements.length === 0) return output;

  const head = lines.slice(0, idx).join("\n").trimEnd();
  const coords = elements.map((el) => JSON.stringify(formatElement(el, format))).join("\n");
  return `${head}\n\n## Coordinates\n${coords}`;
}

/**
 * Extract the prose head and parsed elements from a model response.
 */
export function extractCoordinates(output) {
  const normalized = normalizeCoordinates(output);
  const lines = normalized.split(/\r?\n/);
  const idx = lines.findIndex((l) => /^##\s*Coordinates/i.test(l.trim()));
  if (idx === -1) return { head: normalized.trim(), elements: [] };
  const head = lines.slice(0, idx).join("\n").trimEnd();
  const elements = [];
  for (let i = idx + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || /^#{1,3}\s/.test(line) || /^[-*]\s/.test(line)) continue;
    const el = parseCoordinateLine(line);
    if (el) elements.push(el);
  }
  return { head, elements };
}

/**
 * Map a point from the resampled view back to ORIGINAL image pixels.
 */
export function scaleCenter(center, meta) {
  return {
    x: Math.round(meta.cropX + center.x * (meta.cropW / meta.scaledW)),
    y: Math.round(meta.cropY + center.y * (meta.cropH / meta.scaledH)),
  };
}

/**
 * Map a region from the resampled view back to ORIGINAL image pixels.
 */
export function scaleRegion(region, meta) {
  const sx = meta.cropW / meta.scaledW;
  const sy = meta.cropH / meta.scaledH;
  return {
    x: Math.round(meta.cropX + region.x * sx),
    y: Math.round(meta.cropY + region.y * sy),
    w: Math.round(region.w * sx),
    h: Math.round(region.h * sy),
  };
}

/**
 * Clamp a crop region to the image bounds.
 */
export function clampRegion(r, imgW, imgH) {
  const x = Math.max(0, Math.min(Math.round(r.x), imgW - 1));
  const y = Math.max(0, Math.min(Math.round(r.y), imgH - 1));
  const w = Math.max(1, Math.min(Math.round(r.w), imgW - x));
  const h = Math.max(1, Math.min(Math.round(r.h), imgH - y));
  return { x, y, w, h };
}

/**
 * A square-ish window centered on a point (fraction of the image, min size).
 */
export function windowAround(center, imgW, imgH, frac, minSide) {
  let w = Math.min(imgW, Math.max(minSide, Math.round(imgW * frac)));
  let h = Math.min(imgH, Math.max(minSide, Math.round(imgH * frac)));
  const x = Math.max(0, Math.min(Math.round(center.x - w / 2), imgW - w));
  const y = Math.max(0, Math.min(Math.round(center.y - h / 2), imgH - h));
  return { x, y, w, h };
}

/**
 * Parse round-1 output: {"type":"point",...} or {"type":"region",...}.
 */
export function parseProposal(output) {
  for (const line of output.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || /^#{1,3}\s/.test(t) || /^[-*]\s/.test(t)) continue;
    try {
      const obj = JSON.parse(t.replace(/,\s*$/, ""));
      const name = String(obj?.name ?? "");
      const text = String(obj?.text ?? "");
      if (obj?.type === "point" && obj?.center) {
        const x = Number(obj.center.x);
        const y = Number(obj.center.y);
        if (Number.isFinite(x) && Number.isFinite(y)) {
          return { type: "point", name, text, center: { x, y } };
        }
      }
      if (obj?.type === "region" && obj?.region) {
        const r = obj.region;
        const x = Number(r.x);
        const y = Number(r.y);
        const w = Number(r.w);
        const h = Number(r.h);
        if ([x, y, w, h].every((n) => Number.isFinite(n))) {
          return { type: "region", region: { x, y, w, h } };
        }
      }
    } catch {
      // Fall through to tolerant parsing
    }
  }
  // Tolerant fallback
  const lower = output.toLowerCase();
  const regionIdx = lower.indexOf("region");
  if (regionIdx !== -1) {
    const nums = [...output.slice(regionIdx).matchAll(/-?\d+(?:\.\d+)?/g)].map((m) => Number(m[0]));
    if (nums.length >= 4) {
      return { type: "region", region: { x: nums[0], y: nums[1], w: nums[2], h: nums[3] } };
    }
  }
  const centerIdx = lower.indexOf("center");
  if (centerIdx !== -1) {
    const nums = [...output.slice(centerIdx).matchAll(/-?\d+(?:\.\d+)?/g)].map((m) => Number(m[0]));
    if (nums.length >= 2) {
      return { type: "point", name: "", text: "", center: { x: nums[0], y: nums[1] } };
    }
  }
  return null;
}

/**
 * Parse round-3 output: {"verified":bool,"center":{x,y}}.
 */
export function parseVerify(output) {
  for (const line of output.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || /^#{1,3}\s/.test(t) || /^[-*]\s/.test(t)) continue;
    try {
      const obj = JSON.parse(t.replace(/,\s*$/, ""));
      const c = obj?.center;
      if (c && Number.isFinite(Number(c.x)) && Number.isFinite(Number(c.y))) {
        return { verified: !!obj.verified, center: { x: Number(c.x), y: Number(c.y) } };
      }
    } catch {
      // Fall through to tolerant parsing
    }
  }
  const idx = output.toLowerCase().indexOf("center");
  const tail = idx === -1 ? output : output.slice(idx);
  const nums = [...tail.matchAll(/-?\d+(?:\.\d+)?/g)].map((m) => Number(m[0]));
  if (nums.length >= 2) return { verified: true, center: { x: nums[0], y: nums[1] } };
  return null;
}
