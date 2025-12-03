// src/core/httpClient.ts
import axios from "axios";
import { generateHeader } from "./security";
import { configType } from "./configHelper";
import { decryptBpjsResponse } from "./decrypt";

export const createBpjsClient = (config: configType) => {
  const client = axios.create({
    baseURL: config.baseUrl,
    timeout: 20000,
  });

  client.interceptors.request.use((req) => {
    const headers = generateHeader(config);

    req.headers["X-cons-id"] = headers["X-cons-id"];
    req.headers["X-timestamp"] = headers["X-timestamp"];
    req.headers["X-signature"] = headers["X-signature"];
    req.headers["X-Authorization"] = headers["X-Authorization"];
    req.headers.user_key = headers["userKey"];
    req.headers.Accept = headers["Accept"];

    return req;
  });

  client.interceptors.response.use(
    ({ data, ...rest }) => {
      const { response: encryptedData } = data;
      return typeof encryptedData === "string"
        ? decryptBpjsResponse(
            encryptedData,
            config.consId,
            config.secretKey,
            rest.headers["X-timestamp"] as string
          )
        : JSON.parse(JSON.stringify({})); // Return empty object if response is not a string
    },
    (err) => {
      const message = err.response?.data?.metaData?.message || err.message;
      return err.response || { data: { metaData: { code: 500, message } } };
    }
  );

  return client;
};
