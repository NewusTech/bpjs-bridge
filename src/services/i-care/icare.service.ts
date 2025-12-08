import Redis from "ioredis";
import { BaseUrl } from "../../config/enpoints";
import { configType } from "../../core/configHelper";
import { DataObject } from "../../types/global";
import { IcareFkrtlPayload, IcareFktpPayload } from "../../types/icare";
import { BaseService } from "../base.service";

/**
 * Service untuk mengakses endpoint API Data Riwayat Pelayanan iCare
 */
export class IcareService extends BaseService {
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
      chachePrefix ?? "icare_validate"
    );
  }

  /**
   *
   * @param body
   * @returns
   * @description
   * Fungsi : API Data Riwayat Pelayanan
   */
  async getFktp(body: IcareFktpPayload) {
    const response = await this.callEndpoint<DataObject<{ url: string }>>(
      "ref_poli_antrol",
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
   * Fungsi : API Data Riwayat Pelayanan
   */
  async getFkrtl(body: IcareFkrtlPayload) {
    const response = await this.callEndpoint<DataObject<{ url: string }>>(
      "icare_rs_validate",
      undefined,
      body
    );
    return response.data;
  }
}
