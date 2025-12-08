import { AxiosResponse } from "axios";
import Redis from "ioredis";
import { EndpointName, enpoints } from "../config/enpoints";
import { BpjsCLient, createBpjsClient } from "../core/httpClient";
import {
  BpjsCacheError,
  BpjsEndpointNotFoundError,
  BpjsErrorFactory,
} from "../types/globalErroModule";

export class FktpService {
  private client;
  private redisClient: Redis | null = null;
  private defaultRedisKeyPrefix = "bpjs_bridge_fktp";

  constructor(config: BpjsCLient, redisClient?: Redis, chachePrefix?: string) {
    this.client = createBpjsClient(config); // client dari axios yang sudah disiapkan
    if (redisClient) {
      this.redisClient = redisClient;

      this.redisClient.on("connect", () => {
        console.info("[BRIDGE FKTP BPJS] => ✅ Redis connected");
      });

      this.redisClient.on("error", (err: Error) => {
        console.error("[BRIDGE FKTP BPJS] => ❌ Redis error:", err);
      });

      if (chachePrefix) {
        this.defaultRedisKeyPrefix =
          this.defaultRedisKeyPrefix + "_" + chachePrefix + ":";
      }
    }
  }

  /**
   * Menyimpan data ke Redis dengan TTL (time-to-live)
   * @param key - Kunci data
   * @param value - Data yang akan disimpan
   * @param expInSecond - Waktu kadaluarsa dalam detik (default: 3600)
   */
  private async set<T>(
    key: string,
    value: T,
    expInSecond: number = 3600
  ): Promise<void> {
    if (typeof expInSecond !== "number") {
      expInSecond = 3600;
    }
    try {
      const data =
        typeof value === "object" ? JSON.stringify(value) : String(value);
      await this.redisClient!.set(
        this.defaultRedisKeyPrefix + ":" + key,
        data,
        "EX",
        expInSecond
      );
      // console.info(
      //   `🔵 Redis SET: ${
      //     this.defaultRedisKeyPrefix + key
      //   } (TTL: ${expInSecond}s)`
      // );
    } catch (error) {
      console.error("❌ Redis set error:", error);
      throw new BpjsCacheError("Gagal menyimpan data ke cache", error);
    }
  }

  /**
   * Mengambil data dari Redis
   * @param key - Kunci data
   * @returns Data dari Redis atau null jika tidak ditemukan
   */
  private async get(key: string): Promise<string | null> {
    try {
      const data = await this.redisClient!.get(
        this.defaultRedisKeyPrefix + ":" + key
      );
      if (data) {
        console.info(`🔍 Redis GET: ${this.defaultRedisKeyPrefix + key}`);
        return data;
      }
      // console.warn?.(
      //   `⚠️ Redis GET: ${
      //     this.defaultRedisKeyPrefix + key
      //   } (Data tidak ditemukan)`
      // );
      return null;
    } catch (error) {
      console.error("❌ Redis get error:", error);
      return null;
    }
  }

  /**
   * Menghapus data dari Redis
   * @param key - Kunci data
   */
  private async del(key: string): Promise<void> {
    try {
      await this.redisClient!.del(this.defaultRedisKeyPrefix + ":" + key);
      console.info(`🗑️ Redis DEL: ${this.defaultRedisKeyPrefix + key}`);
    } catch (error) {
      console.error("❌ Redis del error:", error);
    }
  }

  /**
   *
   * @param pattern - Pola kunci untuk menghapus (misal: 'user_*' untuk menghapus semua kunci yang diawali 'user_')
   * Menghapus beberapa kunci berdasarkan pola (pattern)
   */
  private async deleteKeysByPattern(pattern: string) {
    try {
      let cursor = "0";
      pattern = this.defaultRedisKeyPrefix + ":" + pattern;

      do {
        const [nextCursor, foundKeys] = await this.redisClient!.scan(
          cursor,
          "MATCH",
          pattern,
          "COUNT",
          100
        );
        cursor = nextCursor;
        if (foundKeys.length > 0) {
          await this.redisClient!.del(...foundKeys);
        }
      } while (cursor !== "0");
    } catch (error) {
      console.error("❌ Redis delete by pattern error:", error);
      throw new BpjsCacheError(
        "Gagal menghapus data cache berdasarkan pattern",
        error
      );
    }
  }

  /**
   * Membersihkan seluruh cache Redis
   */
  private async flushAll(): Promise<void> {
    try {
      await this.redisClient!.flushall();
      console.info("🧹 Redis cache cleared!");
    } catch (error) {
      console.error("❌ Redis flush error:", error);
      throw new BpjsCacheError("Gagal membersihkan cache", error);
    }
  }

  /**
   * Memanggil endpoint BPJS berdasarkan nama dan parameter yang diberikan
   * @param name
   * @param params
   * @param body
   * @returns
   */
  public async callEndpoint<T>(
    name: EndpointName,
    params: Record<string, any> = {},
    body: Record<string, any> = {}
  ): Promise<AxiosResponse<T>> {
    // Menambahkan tipe return yang jelas
    const endpointConfig = enpoints.find((e) => e.name === name);

    if (!endpointConfig) {
      throw new BpjsEndpointNotFoundError(name);
    }

    // Membentuk URL endpoint dengan menggantikan parameter dinamis
    let endpoint = endpointConfig.endpoint as string;
    Object.keys(params).forEach((key) => {
      endpoint = endpoint.replace(`{${key}}`, params[key]);
    });
    const cacheKey = `${name}:${JSON.stringify(params)}`;
    if (this.redisClient) {
      const cachedData = await this.get(cacheKey);

      if (cachedData) {
        const parsed = JSON.parse(cachedData) as T;
        const cachedResponse: AxiosResponse<T> = {
          data: parsed,
          status: 200,
          statusText: "OK",
          headers: {},
          config: (this.client?.defaults ?? {}) as any,
        };
        return cachedResponse;
      }
    }

    try {
      // Melakukan request sesuai dengan method yang ditentukan di statusConfig
      switch (endpointConfig.method as string) {
        case "GET":
          const res = await this.client({
            url: endpoint,
            method: "GET",
          });

          if (this.redisClient && typeof res.data !== "string") {
            await this.set(cacheKey, res.data);
          }
          return res;
        case "POST":
          return await this.client.post(endpoint, body);
        case "PUT":
          return await this.client.put(endpoint, body);
        case "DELETE":
          return await this.client.delete(endpoint, body);
        default:
          throw new BpjsEndpointNotFoundError(name);
      }
    } catch (error) {
      // console.log("Error in callEndpoint:", error);
      throw BpjsErrorFactory.fromAxios(error);
    }
  }
}
