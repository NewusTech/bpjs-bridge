import { AxiosResponse } from "axios";
import { EndpointName, enpoints } from "../config/enpoints";
import { createBpjsClient } from "../core/httpClient";
import { configType } from "../core/configHelper";
import { BPJSBridgeConfig } from "../config/BPJSConfig";

export class FktpService {
  private client;
  private baseUrl: string;

  constructor(config: configType) {
    this.client = createBpjsClient(config); // client dari axios yang sudah disiapkan
    this.baseUrl = config.baseUrl;
  }

  // Fungsi dinamis untuk mengakses endpoint berdasarkan nama dan parameter
  async callEndpoint<T>(
    name: EndpointName,
    params: Record<string, any> = {}
  ): Promise<AxiosResponse<T>> {
    // Menambahkan tipe return yang jelas
    const endpointConfig = enpoints.find((e) => e.name === name);

    if (!endpointConfig) {
      throw new Error(`Endpoint ${name} tidak ditemukan`);
    }

    // Membentuk URL endpoint dengan menggantikan parameter dinamis
    let endpoint = endpointConfig.endpoint as string;
    Object.keys(params).forEach((key) => {
      endpoint = endpoint.replace(`{${key}}`, params[key]);
    });

    // Melakukan request sesuai dengan method yang ditentukan di statusConfig
    switch (endpointConfig.method as string) {
      case "GET":
        const res = await this.client({
          url: endpoint,
          method: "GET",
        });
        return res;
      case "POST":
        return await this.client.post(endpoint, params);
      case "PUT":
        return await this.client.put(endpoint, params);
      case "DELETE":
        return await this.client.delete(endpoint);
      default:
        throw new Error(`Method ${endpointConfig.method} tidak didukung`);
    }
  }
}
