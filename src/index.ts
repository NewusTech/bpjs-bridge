import Redis from "ioredis";
import { PcareConfig } from "./__test__/config";
import { PcareService } from "./services/pcare/pcare.service";

const service = new PcareService(
  {
    ...PcareConfig,
  },
  new Redis({
    host: "localhost",
    port: 6379,
    password: "",
  })
);

(async function main() {
  try {
    // const diagnosa = await service.getDiagnosa("r51x", 0, 10);
    const diagnosa = await service.getDiagnosa("r51", 0, 10);
    const alergi = await service.getAlergiJenis("03");
    console.log(diagnosa);
    console.log(alergi);
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
})();
