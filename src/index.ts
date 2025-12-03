import { PcareConfig } from "./__test__/config";
import { PcareService } from "./services/pcare/pcare.service";

const service = new PcareService({
  ...PcareConfig,
});

(async function main() {
  try {
    const diagnosa = await service.getDiagnosa("r52", 0, 10);
    console.log(diagnosa);
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
})();
