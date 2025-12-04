// src/services/PcareService.ts
import { configType } from "../../core/configHelper";
import { FktpService } from "../fktp.service";

// Template untuk Service yang bisa dipakai secara dinamis
export class PcareService extends FktpService {
  constructor(config: configType) {
    super(config);
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

  async getAlergiJenis(jenisAlergi: "01" | "02" | "03"): Promise<any> {
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
