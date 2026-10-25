import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || "0a8f4e0f5b619eaa9585b1df6e828b50";
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || "79f4c710726a69d9c777f34fd9d2be9b6da6f8952d79996f12fb205d07140b9a";
const R2_ENDPOINT = process.env.R2_ENDPOINT || "https://63612db9223fc8f86e7ab61a81c7f8ef.r2.cloudflarestorage.com";
const R2_BUCKET = process.env.R2_BUCKET || "cloth";
const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL || "https://pub-c52e7b8c42b44d5c8ce9c706e856a2dd.r2.dev").replace(/\/$/, "");

export const r2Client = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export async function uploadToR2({
  buffer,
  filename,
  contentType,
  folder = "products",
}: {
  buffer: Buffer;
  filename: string;
  contentType: string;
  folder?: string;
}) {
  // Clean filename: remove special characters, spaces to hyphens
  const ext = filename.split(".").pop()?.toLowerCase() || "jpg";
  const baseName = filename
    .substring(0, filename.lastIndexOf("."))
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .substring(0, 40);
  const key = `${folder}/${Date.now()}_${baseName}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await r2Client.send(command);

  return {
    key,
    url: `${R2_PUBLIC_URL}/${key}`,
    bucket: R2_BUCKET,
  };
}

export async function listR2Objects(prefix = "products/") {
  const command = new ListObjectsV2Command({
    Bucket: R2_BUCKET,
    Prefix: prefix,
    MaxKeys: 100,
  });

  const response = await r2Client.send(command);
  const contents = response.Contents || [];

  return contents.map((item) => ({
    key: item.Key || "",
    url: `${R2_PUBLIC_URL}/${item.Key}`,
    size: item.Size || 0,
    lastModified: item.LastModified,
  }));
}

export async function deleteFromR2(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
  });

  await r2Client.send(command);
  return { success: true };
}
