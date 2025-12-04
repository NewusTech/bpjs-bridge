import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { configType } from "./configHelper";
import { generateHeader } from "./security";
import { decryptBpjsResponse } from "./decrypt";
import { BrigeError } from "../types/globalModle";

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
        return { ...res, data: decrypted };
      }
      res.data = `[HTTP CLIENT ERROR => URL : ${res.config.baseURL}/${
        res.config.url
      } ] => ${res.data.metaData?.message || "unknown error"}`;
      return res;
    },
    (err) => {
      console.error(
        "[HTTP CLIENT ERROR]",
        err.message + " || " + JSON.stringify(err.response?.data) || ""
      );
      const fallback: AxiosResponse = {
        data: `[HTTP CLIENT ERROR => URL : ${err.config.baseURL}/${
          err.config.url
        } ] => ${
          err.response?.data?.metaData?.message ??
          err.message ??
          "unknown error"
        }`,
        status: err.status || 500,
        statusText: err.message || "Internal Server Error",
        headers: {},
        config: err.config || {},
      };
      return fallback;
    }
  );

  return client;
};
