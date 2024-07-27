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
  return fetch(url)
    .then(res => res.arrayBuffer())
    .then(buffer => `data:${dataType};base64,${Buffer.from(buffer).toString("base64")}`);
}

export const mediaURLtoBase64 = async (url: string) => {
  switch (url.split(".").pop()?.replace(/\?.*/, "")) {
    case "png":
      return URLtoBase64(url, "image/png");
    case "jpg":
      return URLtoBase64(url, "image/jpeg");
    case "webp":
      return URLtoBase64(url, "image/webp");
    case "gif":
      return URLtoBase64(url, "image/gif");
    default:
      return null;
  }
}

export const prettyDuration = (duration: number) => {
  const seconds = Math.floor(duration / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  return `${days ? `${days}:` : ""}${(hours % 24).toString().padStart(2, "0")}:${(minutes % 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
}