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
  ): Promise<any> {
    const response = await this.callEndpoint<DataArray<Diagnose>>("diagnosa", {
      kodediag,
      start,
      limit,
    });

    console.log(response.data);
    return response.data.response;
  }

  async getAlergiJenis(jenisAlergi: "01" | "02" | "03"): Promise<any> {
    const response = await this.callEndpoint<DataArray<AllergyType>>(
      "alergi_jenis",
      { jenisAlergi }
    );
    return response.data.response;
  }

  async getDokter(start: number, limit: number): Promise<any> {
    const response = await this.callEndpoint<DataArray<any>>("dokter", {
      start,
      limit,
    });
    return response.data.response;
  }
  async getKesadaran(): Promise<any> {
    const response = await this.callEndpoint<DataArray<any>>("kesadaran");
    return response.data.response;
  }

  async getRujukanKunjungan(nomorKunjungan: string): Promise<any> {
    const response = await this.callEndpoint<any>("rujukan_kunjungan", {
      nomorKunjungan,
    });
    return response.data.response;
  }
}
