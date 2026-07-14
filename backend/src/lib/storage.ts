import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import crypto from "crypto";

export interface UploadResult {
  url: string;
  secureName: string;
}

export interface StorageProvider {
  uploadFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    uploadType: "LOGO" | "DOCUMENT"
  ): Promise<UploadResult>;
}

export class LocalStorageProvider implements StorageProvider {
  async uploadFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    uploadType: "LOGO" | "DOCUMENT"
  ): Promise<UploadResult> {
    const fileExt = mimeType === "application/pdf"
      ? "pdf"
      : mimeType === "application/msword"
      ? "doc"
      : mimeType === "image/png"
      ? "png"
      : mimeType === "image/webp"
      ? "webp"
      : "docx"; // default fallback for ALLOWED_DOC_TYPES

    const secureName = `${crypto.randomUUID()}.${fileExt}`;
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = join(uploadDir, secureName);
    await writeFile(filePath, buffer);

    return {
      url: `/uploads/${secureName}`,
      secureName,
    };
  }
}

export class CloudinaryStorageProvider implements StorageProvider {
  async uploadFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    uploadType: "LOGO" | "DOCUMENT"
  ): Promise<UploadResult> {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || "unsigned_preset";

    if (!cloudName) {
      console.warn("Cloudinary configuration missing, falling back to LocalStorageProvider");
      const local = new LocalStorageProvider();
      return local.uploadFile(buffer, originalName, mimeType, uploadType);
    }

    try {
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
      const base64Data = `data:${mimeType};base64,${buffer.toString("base64")}`;

      const formData = new FormData();
      formData.append("file", base64Data);

      if (apiKey && apiSecret) {
        const timestamp = Math.round(new Date().getTime() / 1000).toString();
        const paramsToSign = `timestamp=${timestamp}${apiSecret}`;
        const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

        formData.append("timestamp", timestamp);
        formData.append("api_key", apiKey);
        formData.append("signature", signature);
      } else {
        formData.append("upload_preset", uploadPreset);
      }

      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Cloudinary upload failed: ${errText}`);
      }

      const data = await res.json() as { secure_url: string; public_id: string };
      return {
        url: data.secure_url,
        secureName: data.public_id,
      };
    } catch (error) {
      console.error("[CloudinaryStorageProvider] Error:", error);
      const local = new LocalStorageProvider();
      return local.uploadFile(buffer, originalName, mimeType, uploadType);
    }
  }
}

// Current active storage provider configuration
export const storageProvider: StorageProvider = process.env.CLOUDINARY_CLOUD_NAME 
  ? new CloudinaryStorageProvider() 
  : new LocalStorageProvider();

