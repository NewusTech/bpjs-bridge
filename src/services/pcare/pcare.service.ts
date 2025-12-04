// src/services/PcareService.ts
import Redis from "ioredis";
import { configType } from "../../core/configHelper";
import { FktpService } from "../fktp.service";

/**
 * Service untuk mengakses endpoint PCare BPJS
 */
export class PcareService extends FktpService {
  /**
   * Constructor PcareService
   * @param config konfigurasi BPJS
   * @param redisClient instance Redis (opsional)
   * @param chachePrefix prefix untuk cache Redis (opsional)
   */
  constructor(config: configType, redisClient?: Redis, chachePrefix?: string) {
    super(config, redisClient, chachePrefix ?? "pcare");
  }
  // Contoh penggunaan: memanggil endpoint diagnosa
  async getDiagnosa(
    kodediag: string,
    start: number,
    limit: number
  ): Promise<DataPaginate<Diagnose>> {
    const response = await this.callEndpoint<DataPaginate<Diagnose>>(
      "diagnosa",
      {
        kodediag,
        start,
        limit,
      }
    );
    return response.data;
  }

  async getAlergiJenis(jenisAlergi: "01" | "02" | "03" | "09"): Promise<any> {
    const response = await this.callEndpoint<DataArray<AllergyType>>(
      "alergi_jenis",
      { jenisAlergi }
    );
    return response.data;
  }

  async getDokter(start: number, limit: number): Promise<any> {
    const response = await this.callEndpoint<DataArray<any>>("dokter", {
      start,
      limit,
    });
    return response.data;
  }
  async getKesadaran(): Promise<any> {
    const response = await this.callEndpoint<DataArray<any>>("kesadaran");
    return response.data;
  }

  async getRujukanKunjungan(nomorKunjungan: string): Promise<any> {
    const response = await this.callEndpoint<any>("rujukan_kunjungan", {
      nomorKunjungan,
    });
    return response.data;
  }
}
