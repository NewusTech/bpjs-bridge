import * as crypto from "crypto"; // Pastikan path logger sesuai dengan struktur proyek Anda
import { decompressFromEncodedURIComponent } from "lz-string";

type DecryptedResponse = Record<string, any>;

export const decryptBpjsResponse = (
  encryptedData: string,
  cons_id: string,
  secret_key: string,
  timestamp: string
): DecryptedResponse => {
  try {
    if (
      !encryptedData ||
      typeof encryptedData !== "string" ||
      encryptedData.trim() === ""
    ) {
      throw new Error("⚠️ Response BPJS kosong atau tidak terformat base64");
    }

    // Membuat key dengan SHA-256 hash dari kons_id, secret_key, dan timestamp
    const key = crypto
      .createHash("sha256")
      .update(cons_id + secret_key + timestamp)
      .digest();

    const iv = key.subarray(0, 16);

    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(Buffer.from(encryptedData, "base64"));

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    const decryptedText = decrypted.toString();

    const decompressedText = decompressFromEncodedURIComponent(decryptedText);
    const finalText = decompressedText || decryptedText;

    return JSON.parse(finalText);
  } catch (error: any) {
    throw new Error(`[DECRYPT ERROR] ${error.message}`);
  }
};
