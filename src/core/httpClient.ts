import axios, { AxiosError, AxiosResponse } from "axios";
import { configType } from "./configHelper";
import { decryptBpjsResponse } from "./decrypt";
import { generateHeader } from "./security";
import { BpjsDecryptionError } from "../types/globalErroModule";

export type BpjsCLient = {
  baseUrl: string;
} & configType;

export const createBpjsClient = (config: BpjsCLient) => {
  const client = axios.create({
    baseURL: config.baseUrl,
    timeout: 20000,
  });

  const headers = generateHeader(config);

  client.interceptors.request.use((req) => {
    req.headers["X-cons-id"] = headers["X-cons-id"];
    req.headers["X-timestamp"] = headers["X-timestamp"];
    req.headers["X-signature"] = headers["X-signature"];
    req.headers["X-Authorization"] = headers["X-Authorization"];
    req.headers.user_key = headers["userKey"];
    req.headers.Accept = headers["Accept"];
    req.headers["User-Agent"] = "BPJS-Bridge-Client/1.0";
    req.headers["Accept-Encoding"] = "gzip, compress, deflate, br";

    return req;
  });

  client.interceptors.response.use(
    async (res: AxiosResponse) => {
      const url = `${res.config.method?.toUpperCase()} ${res.config.baseURL}/${
        res.config.url
      }`;
      const { response: encryptedData } = res.data;
      if (encryptedData) {
        if (typeof encryptedData !== "string") {
          throw new BpjsDecryptionError(
            `[DECRYPTION ERROR] ${url} Format encrypted data tidak valid, expected string`,
            { type: typeof encryptedData, data: encryptedData }
          );
        }

        try {
          const timestamp = String(headers["X-timestamp"]);

          if (!timestamp) {
            throw new Error("Timestamp tidak tersedia untuk decryption");
          }

          const decrypted = decryptBpjsResponse(
            encryptedData,
            config.consId,
            config.secretKey,
            timestamp
          );

          return {
            ...res,
            data: decrypted,
            headers: {
              ...res.headers,
              "x-decrypted": "true",
            },
          };
        } catch (decryptError: any) {
          throw new BpjsDecryptionError(
            `[DECRYPTION ERROR] ${url} : ${decryptError.message}`,
            {
              originalError: decryptError,
              encryptedLength: encryptedData.length,
              consId: config.consId,
            }
          );
        }
      }
      res.data = `[HTTP CLIENT ERROR => URL : ${res.config.baseURL}/${
        res.config.url
      } ] => ${"NO_CONTENT_IN_RESPONSE"}`;
      res.status = 204;
      res.statusText = "No Content";

      const AxiosError: AxiosError = {
        name: "BpjsResponseError",
        code: "NO_CONTENT_IN_RESPONSE",
        message: res.data,
        status: res.status,
        config: res.config,
        isAxiosError: true,
        response: {
          data: res.data,
          status: res.status,
          statusText: res.statusText,
          headers: res.headers,
          config: res.config,
        },
        toJSON: () => ({}),
      };

      return Promise.reject(AxiosError);
    },
    (err) => {
      const url = `${err.config.method?.toUpperCase()} ${err.config.baseURL}/${
        err.config.url
      }`;
      const fallBackResponse: AxiosResponse = {
        data: {
          message: `[HTTP CLIENT ERROR => URL : ${url} ] => ${
            err.response?.data?.metaData?.message ??
            err.message ??
            "unknown error"
          }`,
          originalResponse: err.response?.data,
        },
        status: err.response?.data?.metaData?.code || err.status || 500,
        statusText:
          err.response?.data?.metaData?.message ??
          (err.message || "Internal Server Error"),
        headers: {},
        config: err.config || {},
      };

      const AxiosError: AxiosError = {
        name: "BpjsResponseError",
        message: fallBackResponse.data.message,
        status: fallBackResponse.status,
        config: fallBackResponse.config,
        isAxiosError: true,
        response: {
          data: fallBackResponse.data,
          status: fallBackResponse.status,
          statusText: fallBackResponse.statusText,
          headers: err.headers,
          config: fallBackResponse.config,
        },
        toJSON: () => ({}),
      };
      return Promise.reject(AxiosError);
    }
  );

  return client;
};
