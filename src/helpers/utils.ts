import fs from "fs/promises";

const mimeTypeMap: { [key: string]: string } = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
};

/**
 * Converts a URI to a Base64 string.
 * If the URI is a local file, it will be read using `fs.readFile`, otherwise it will be fetched.
 * @param uri The URI to convert.
 */
export async function URItoBase64(uri: string) {
  if (!uri) {return null}
  const ext = uri.split('.').pop();
  if (uri.startsWith('./')) {
    const buffer = await fs.readFile(uri);
    const dataType = mimeTypeMap[ext as string] || "application/octet-stream";
    return `data:${dataType};base64,${buffer.toString('base64')}`;
  }
  const res = await fetch(uri);
  const buffer = await res.arrayBuffer();
  const contentType = res.headers.get("content-type");
  return `data:${contentType};base64,${Buffer.from(buffer).toString("base64")}`;
}

export function prettyDuration(duration: number) {
  const seconds = Math.floor(duration / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const set = [days, hours % 24, minutes % 60, seconds % 60]
  const string = [];
  for (let i = 0; i < set.length; i++) {
    const unit = set[i];
    if (!unit && !string.length && i < 2) continue;
    if (string.length) {
      string.push(unit.toString().padStart(2, "0"));
    } else {
      string.push(unit.toString());
    }
  }
  return string.join(":");
}

export function mixColors(color1: string, color2: string, strength: number): string {
  const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };
  const rgbToHex = (r: number, g: number, b: number) =>
    `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

  const [r1, g1, b1] = hexToRgb(color1);
  const [r2, g2, b2] = hexToRgb(color2);
  const mixedR = Math.round((r1 * strength + r2 * (1 - strength)));
  const mixedG = Math.round((g1 * strength + g2 * (1 - strength)));
  const mixedB = Math.round((b1 * strength + b2 * (1 - strength)));

  return rgbToHex(mixedR, mixedG, mixedB);
}