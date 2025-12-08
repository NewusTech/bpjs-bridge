// src/services/PcareService.ts
import Redis from "ioredis";
import { BaseUrl } from "../../config/enpoints";
import { configType } from "../../core/configHelper";
import { BaseService } from "../base.service";
import { AlergiModule } from "./module/alergi.module";
import { DiagnosaModule } from "./module/diagnosa.module";
import { DokterModule } from "./module/dokter.module";
import { KesadaranModule } from "./module/kesadaran.module";
import { KunjunganModule } from "./module/kunjungan.module";
import { MCUModule } from "./module/mcu.module";
import { ObatModule } from "./module/obat.module";
import { PendaftaranModule } from "./module/pendafataran.module";
import { PesertaModule } from "./module/peserta.module";
import { PoliModule } from "./module/poli.module";
import { PrognosaModule } from "./module/prognosa.module";
import { ProviderModule } from "./module/provider.module";
import { SpesialisModule } from "./module/spesialis.module";
import { StatusPulangModule } from "./module/statusPulang.module";
import { TindakanPulangModule } from "./module/tindakan.module";

/**
 * Service untuk mengakses endpoint PCare BPJS
 */
export class PcareService extends BaseService {
  public readonly diagnosa!: DiagnosaModule;
  public readonly obat!: ObatModule;
  public readonly dokter!: DokterModule;
  public readonly kunjungan!: KunjunganModule;
  public readonly kesadaran!: KesadaranModule;
  public readonly poli!: PoliModule;
  public readonly provider!: ProviderModule;
  public readonly prognosa!: PrognosaModule;
  public readonly statusPulang!: StatusPulangModule;
  public readonly tindakan!: TindakanPulangModule;
  public readonly alergi!: AlergiModule;
  public readonly peserta!: PesertaModule;
  public readonly mcu!: MCUModule;
  public readonly pendaftaran!: PendaftaranModule;
  public readonly spesialis!: SpesialisModule;

  /**
   * Constructor PcareService
   * @param config konfigurasi BPJS
   * @param redisClient instance Redis (opsional)
   * @param chachePrefix prefix untuk cache Redis (opsional)
   */
  constructor(config: configType, redisClient?: Redis, chachePrefix?: string) {
    const getBaseUrl = BaseUrl[config.mode].url_pcare;
    super(
      { ...config, baseUrl: getBaseUrl },
      redisClient,
      chachePrefix ?? "pcare"
    );

    this.diagnosa = new DiagnosaModule(this);
    this.obat = new ObatModule(this);
    this.dokter = new DokterModule(this);
    this.kunjungan = new KunjunganModule(this);
    this.kesadaran = new KesadaranModule(this);
    this.poli = new PoliModule(this);
    this.provider = new ProviderModule(this);
    this.prognosa = new PrognosaModule(this);
    this.statusPulang = new StatusPulangModule(this);
    this.tindakan = new TindakanPulangModule(this);
    this.alergi = new AlergiModule(this);
    this.peserta = new PesertaModule(this);
    this.mcu = new MCUModule(this);
    this.pendaftaran = new PendaftaranModule(this);
    this.spesialis = new SpesialisModule(this);
  }
}
