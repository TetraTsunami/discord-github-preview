import fs from "fs/promises";

export const pngURLtoBase64 = async (url: string) => {
  return fetch(url)
    .then(res => res.arrayBuffer())
    .then(buffer => `data:image/png;base64,${Buffer.from(buffer).toString("base64")}`);
};

export const jpgURLtoBase64 = async (url: string) => {
  return fetch(url)
    .then(res => res.arrayBuffer())
    .then(buffer => `data:image/jpeg;base64,${Buffer.from(buffer).toString("base64")}`);
}

export const URLtoBase64 = async (url: string, dataType: string) => {
  if (url.startsWith('.')) {
    const buffer = await fs.readFile(url);
    return `data:${dataType};base64,${buffer.toString('base64')}`;
  } else {
    return fetch(url)
      .then(res => res.arrayBuffer())
      .then(buffer => `data:${dataType};base64,${Buffer.from(buffer).toString("base64")}`);
  }
}

const mimeTypeMap: { [key: string]: string } = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
};
export const mediaURLtoBase64 = async (url: string) => {
  const extension = url.split(".").pop()?.replace(/\?.*/, "");
  if (!mimeTypeMap.hasOwnProperty(extension as string)) {
    return null;
  }
  const mimeType = extension ? mimeTypeMap[extension] : null;
  return mimeType ? URLtoBase64(url, mimeType) : null;
}

export const prettyDuration = (duration: number) => {
  const seconds = Math.floor(duration / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  return `${days ? `${days}:` : ""}${(hours % 24).toString().padStart(2, "0")}:${(minutes % 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
}