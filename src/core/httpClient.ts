// // src/core/httpClient.ts
// import axios from "axios";
// import { generateHeader } from "./security";
// import { configType } from "./configHelper";
// import { decryptBpjsResponse } from "./decrypt";

// export const createBpjsClient = (config: configType) => {
//   const client = axios.create({
//     baseURL: config.baseUrl,
//     timeout: 20000,
//   });

//   client.interceptors.request.use((req) => {
//     const headers = generateHeader(config);

//     req.headers["X-cons-id"] = headers["X-cons-id"];
//     req.headers["X-timestamp"] = headers["X-timestamp"];
//     req.headers["X-signature"] = headers["X-signature"];
//     req.headers["X-Authorization"] = headers["X-Authorization"];
//     req.headers.user_key = headers["userKey"];
//     req.headers.Accept = headers["Accept"];

//     return req;
//   });

//   client.interceptors.response.use(
//     ({ data, ...rest }) => {
//       console.log("raw", data);
//       const { response: encryptedData } = data;
//       return typeof encryptedData === "string"
//         ? decryptBpjsResponse(
//             encryptedData,
//             config.consId,
//             config.secretKey,
//             rest.headers["X-timestamp"] as string
//           )
//         : JSON.parse(JSON.stringify({})); // Return empty object if response is not a string
//     },
//     (err) => {
//       const message = err.response?.data?.metaData?.message || err.message;
//       return err.response || { data: { metaData: { code: 500, message } } };
//     }
//   );

//   return client;
// };

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { configType } from "./configHelper";
import { generateHeader } from "./security";
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
    async (res: AxiosResponse) => {
      // console.log("raw", res.data);
      const { response: encryptedData } = res.data;

      // Ensure encryptedData is a string before trying to decrypt
      if (typeof encryptedData === "string") {
        const decrypted = decryptBpjsResponse(
          encryptedData,
          config.consId,
          config.secretKey,
          res.headers["X-timestamp"] as string
        );
        // Return a full AxiosResponse with decrypted payload in data
        return { ...res, data: decrypted };
      }

      // Return an AxiosResponse with empty object if response is not a string
      return { ...res, data: {} };
    },
    (err) => {
      console.log(err);
      const message = err.response?.data?.metaData?.message || err.message;

      // // If axios already provided a response, reject with it to preserve details
      // if (err.response) {
      //   return Promise.reject(err.response);
      // }

      // Otherwise construct a minimal AxiosResponse-like fallback and reject
      const fallback: AxiosResponse = {
        data: { metaData: { code: 500, message } },
        status: 500,
        statusText: "Internal Server Error",
        headers: {},
        config: err.config || {},
      };
      return fallback;
      // return Promise.reject(fallback);
    }
  );

  return client;
};
