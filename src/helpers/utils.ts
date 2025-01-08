import fs from "fs/promises";

const mimeTypeMap: { [key: string]: string } = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
};

export async function mediaURLtoBase64(url: string) {
  if (!url) {
    return null;
  }
  const extension = url.split(".").pop()?.replace(/\?.*/, "");
  if (!mimeTypeMap.hasOwnProperty(extension as string)) {
    return null;
  }
  const mimeType = extension ? mimeTypeMap[extension] : null;
  return mimeType ? URLtoBase64(url, mimeType) : null;
}

export async function URLtoBase64(url: string, dataType: string) {
  let trueURL = url;
  if (url.startsWith('.')) {
    const buffer = await fs.readFile(url);
    return `data:${dataType};base64,${buffer.toString('base64')}`;
  } else if (url.startsWith('spotify:')) {
    const parts = url.split(':'),
     id = parts[parts.length - 1];
    trueURL = `https://i.scdn.co/image/${id}`;
  }
  return fetch(trueURL)
    .then(res => res.arrayBuffer())
    .then(buffer => `data:${dataType};base64,${Buffer.from(buffer).toString("base64")}`);
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
    if (!unit || string.length) {
      string.push(unit.toString().padStart(2, "0"));
    } else {
      string.push(unit.toString());
    }
  }
  return string.join(":");
}