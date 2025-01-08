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