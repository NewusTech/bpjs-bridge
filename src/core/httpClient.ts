import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { configType } from "./configHelper";
import { generateHeader } from "./security";
import { decryptBpjsResponse } from "./decrypt";

export const createBpjsClient = (config: configType) => {
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
    req.headers.Accept = "application/json";
    req.headers["User-Agent"] = "BPJS-Bridge-Client/1.0";
    req.headers["Accept-Encoding"] = "gzip, compress, deflate, br";

    return req;
  });

  client.interceptors.response.use(
    async (res: AxiosResponse) => {
      const { response: encryptedData } = res.data;

      // Ensure encryptedData is a string before trying to decrypt
      if (typeof encryptedData === "string") {
        const timestamp = String(headers["X-timestamp"]);
        const decrypted = decryptBpjsResponse(
          encryptedData,
          config.consId,
          config.secretKey,
          timestamp
        );
        // Return a full AxiosResponse with decrypted payload in data
        return { ...res, data: decrypted };
      }

      // Return an AxiosResponse with empty object if response is not a string
      return { ...res, data: res.data ?? "No Content" };
    },
    (err) => {
      console.error(err);
      const fallback: AxiosResponse = {
        data: err.response?.data?.metaData?.message ?? "Unkown Error",
        status: err.status || 500,
        statusText: err.message || "Internal Server Error",
        headers: {},
        config: err.config || {},
      };
      return fallback;
      // return Promise.reject(fallback);
    }
  );

  return client;
};
