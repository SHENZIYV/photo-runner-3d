import * as THREE from "three";

export async function loadPhotoTexture(path: string): Promise<THREE.CanvasTexture> {
  const image = new Image();
  image.decoding = "async";
  image.src = path;
  await image.decode();
  return createPhotoAtlas(image, "#54d4c4");
}

export async function createPhotoAtlas(image: HTMLImageElement, accent: string): Promise<THREE.CanvasTexture> {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 640;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to create character photo canvas");

  const sourceRatio = image.width / image.height;
  const targetRatio = canvas.width / canvas.height;
  let sourceWidth = image.width;
  let sourceHeight = image.height;
  let sourceX = 0;
  let sourceY = 0;
  if (sourceRatio > targetRatio) {
    sourceWidth = image.height * targetRatio;
    sourceX = (image.width - sourceWidth) / 2;
  } else {
    sourceHeight = image.width / targetRatio;
    sourceY = (image.height - sourceHeight) * 0.25;
  }

  context.fillStyle = "#0a151c";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 20, 20, 472, 600);
  context.strokeStyle = accent;
  context.lineWidth = 14;
  context.strokeRect(12, 12, 488, 616);
  context.fillStyle = "rgba(7, 16, 24, 0.22)";
  context.fillRect(20, 520, 472, 100);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 2;
  texture.needsUpdate = true;
  return texture;
}
