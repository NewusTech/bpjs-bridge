import Redis from "ioredis";
import { configType } from "../../core/configHelper";

import { BaseUrl } from "../../config/enpoints";
import { DataArray } from "../../types/global";
import {
  AntreanFktpBatalPayload,
  AntreanFktpPayload,
  AntreanFktpReferensiDokterType,
  AntreanFktpReferensiPoliType,
  AntreanFktpStatusPayload,
} from "../../types/antreanFktp";
import { BaseService } from "../base.service";

/**
 * Service untuk mengakses endpoint Antrean BPJS FKTP
 */
export class AntreanFktpService extends BaseService {
  /**
   * Constructor AntreanFktpService
   * @param config konfigurasi BPJS
   * @param redisClient instance Redis (opsional)
   * @param chachePrefix prefix untuk cache Redis (opsional)
   */
  constructor(config: configType, redisClient?: Redis, chachePrefix?: string) {
    const getBaseUrl = BaseUrl[config.mode].url_antrean_fktp;
    super(
      { ...config, baseUrl: getBaseUrl },
      redisClient,
      chachePrefix ?? "antreanfktp"
    );
  }

  /**
   *
   * @param tanggal
   * @returns
   * @description
   * Melihat referensi poli pada layanan antrean (WS Antrol)
   */
  async getReferensiPoli(tanggal: string) {
    const response = await this.callEndpoint<
      DataArray<AntreanFktpReferensiPoliType>
    >("ref_poli_antrol", { tanggal });
    return response.data;
  }

  /**
   *
   * @param kodepoli
   * @param tanggal
   * @returns
   * @description
   * Melihat daftar dokter berdasarkan poli dan tanggal
   */
  async getReferensiDokter(kodepoli: string, tanggal: string) {
    const response = await this.callEndpoint<
      DataArray<AntreanFktpReferensiDokterType>
    >("ref_dokter_antrol", { kodepoli, tanggal });
    return response.data;
  }

  /**
   *
   * @param body
   * @returns
   * @description
   * Menambah data antrean pasien
   */
  async add(body: AntreanFktpPayload) {
    const response = await this.callEndpoint<null>(
      "tambah_antrean",
      undefined,
      body
    );
    return response.data;
  }

  /**
   *
   * @param body
   * ### notes :
   * - Status 1 = Hadir; Status 2 = Tidak Hadir
   * - Waktu dalam bentuk timestamp milisecond
   * @returns
   * @description
   * Update status antrean hadir/tidak hadir
   */
  async updateStatus(body: AntreanFktpStatusPayload) {
    const response = await this.callEndpoint<null>(
      "update_status_antrean",
      undefined,
      body
    );
    return response.data;
  }

  /**
   *
   * @param body
   * @returns
   * @description
   * Membatalkan antrean pasien
   */
  async batal(body: AntreanFktpBatalPayload) {
    const response = await this.callEndpoint<null>(
      "update_status_antrean",
      undefined,
      body
    );
    return response.data;
  }
}
