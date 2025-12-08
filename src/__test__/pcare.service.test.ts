import { redis } from "../lib/redis";
import { PcareService } from "../services/pcare/pcare.service";
import { PcareConfig } from "./config";

// Setup PcareService
const pcareService = new PcareService(PcareConfig, redis, "redis_prefix_test");

describe("PcareService", () => {
  afterAll(() => {
    redis.disconnect();
  });
  it("should load environment variables", () => {
    console.log(PcareConfig);
    expect(PcareConfig).toBeDefined();
  });
  it("should fetch diagnosa data", async () => {
    const response = await pcareService.diagnosa.get("r51", 0, 10);
    expect(response).toEqual(
      expect.objectContaining({
        count: expect.any(Number), // count harus berupa number
        list: expect.arrayContaining([
          // list harus berupa array
          expect.objectContaining({
            kdDiag: expect.any(String), // kdDiag harus berupa string
            nmDiag: expect.any(String), // nmDiag harus berupa string
            nonSpesialis: expect.any(Boolean), // nonSpesialis harus berupa boolean
          }),
        ]),
      })
    );
  });

  it("should fetch getAlergiJenis 01", async () => {
    const response = await pcareService.alergi.get("01");
    expect(response).toEqual(
      expect.objectContaining({
        list: expect.arrayContaining([
          // list harus berupa array
          expect.objectContaining({
            kdAlergi: expect.any(String), // kdAlergi harus berupa string
            nmAlergi: expect.any(String), // nmAlergi harus berupa string
          }),
        ]),
      })
    );
  });
  it("should fetch getDokter", async () => {
    const response = await pcareService.dokter.get(0, 1);
    expect(response).toEqual(
      expect.objectContaining({
        count: expect.any(Number),
        list: expect.arrayContaining([
          expect.objectContaining({
            kdDokter: expect.any(String),
            nmDokter: expect.any(String),
          }),
        ]),
      })
    );
  });
  it("should fetch getKesadaran", async () => {
    const response = await pcareService.kesadaran.get();
    expect(response).toEqual(
      expect.objectContaining({
        count: expect.any(Number),
        list: expect.arrayContaining([
          expect.objectContaining({
            kdSadar: expect.any(String),
            nmSadar: expect.any(String),
          }),
        ]),
      })
    );
  });
  it("should fetch getDPHO", async () => {
    const response = await pcareService.obat.getDPHO("a", 0, 1);
    expect(response).toEqual(
      expect.objectContaining({
        count: expect.any(Number),
        list: expect.arrayContaining([
          expect.objectContaining({
            kdObat: expect.any(String),
            nmObat: expect.any(String),
            sedia: expect.any(Number),
          }),
        ]),
      })
    );
  });
  it("should fetch Poli FKTP", async () => {
    const response = await pcareService.poli.get(0, 1);
    expect(response).toEqual(
      expect.objectContaining({
        count: expect.any(Number),
        list: expect.arrayContaining([
          expect.objectContaining({
            kdPoli: expect.any(String),
            nmPoli: expect.any(String),
            poliSakit: expect.any(Boolean),
          }),
        ]),
      })
    );
  });
  it("should fetch Provider Rayonisasi", async () => {
    const response = await pcareService.provider.get(0, 1);
    expect(response).toEqual(
      expect.objectContaining({
        count: expect.any(Number),
        list: expect.arrayContaining([
          expect.objectContaining({
            kdProvider: expect.any(String),
            nmProvider: expect.any(String),
          }),
        ]),
      })
    );
  });
  it("should fetch Status Pulang", async () => {
    const response = await pcareService.statusPulang.get(false);
    expect(response).toEqual(
      expect.objectContaining({
        count: expect.any(Number),
        list: expect.arrayContaining([
          expect.objectContaining({
            kdStatusPulang: expect.any(String),
            nmStatusPulang: expect.any(String),
          }),
        ]),
      })
    );
  });
  it("should fetch Referensi Tindakan", async () => {
    const response = await pcareService.tindakan.getReferensi("10", 0, 1);
    expect(response).toEqual(
      expect.objectContaining({
        count: expect.any(Number),
        list: expect.arrayContaining([
          expect.objectContaining({
            kdTindakan: expect.any(String),
            nmTindakan: expect.any(String),
            maxTarif: expect.any(Number),
            withValue: expect.any(Boolean),
          }),
        ]),
      })
    );
  });
  it("should fetch Prognosa", async () => {
    const response = await pcareService.prognosa.get();
    expect(response).toEqual(
      expect.objectContaining({
        list: expect.arrayContaining([
          expect.objectContaining({
            kdPrognosa: expect.any(String),
            nmPrognosa: expect.any(String),
          }),
        ]),
      })
    );
  });
});
