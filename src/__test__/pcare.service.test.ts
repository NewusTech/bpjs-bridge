// // src/__test__/pcare.service.test.ts
// import { PcareService } from "../services/pcare/pcare.service"; // Ensure correct import
// import { FktpService } from "../services/fktp.service";
// import { PcareConfig } from "./config";

// // Mocking FktpService
// jest.mock("../services/fktp.service", () => {
//   return {
//     FktpService: jest.fn().mockImplementation(() => {
//       return {
//         callEndpoint: jest.fn(),
//         // Mocking getDiagnosa and other methods directly
//         getDiagnosa: jest.fn(),
//         getAlergiJenis: jest.fn(),
//         getDokter: jest.fn(),
//         getKesadaran: jest.fn(),
//         getRujukanKunjungan: jest.fn(),
//       };
//     }),
//   };
// });

// describe("PcareService", () => {
//   let pcareService: PcareService;
//   let mockCallEndpoint: jest.Mock;
//   let mockGetDiagnosa: jest.Mock;å
//   let mockGetAlergiJenis: jest.Mock;

//   beforeEach(() => {
//     // Create the mock for axios client and other method mocks
//     mockCallEndpoint = jest.fn();
//     mockGetDiagnosa = jest.fn();
//     mockGetAlergiJenis = jest.fn();

//     // Mock implementation for the `FktpService` methods
//     (FktpService as unknown as jest.Mock).mockImplementation(() => ({
//       callEndpoint: mockCallEndpoint,
//       getDiagnosa: mockGetDiagnosa,
//       getAlergiJenis: mockGetAlergiJenis,
//     }));

//     // Create instance of PcareService
//     pcareService = new PcareService({
//       ...PcareConfig,
//       /* your config here */
//     });
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it("should call getDiagnosa and return correct response", async () => {
//     const mockResponse = ["diagnosa1", "diagnosa2"];
//     mockGetDiagnosa.mockResolvedValue(mockResponse);

//     const result = await pcareService.getDiagnosa("code123", 0, 10);

//     expect(mockGetDiagnosa).toHaveBeenCalledWith("code123", 0, 10);
//     expect(result).toEqual(mockResponse);
//   });
//   ``;

//   it("should call getAlergiJenis and return correct response", async () => {
//     const mockResponse = ["alergi1", "alergi2"];
//     mockGetAlergiJenis.mockResolvedValue(mockResponse);

//     const result = await pcareService.getAlergiJenis("01");

//     expect(mockGetAlergiJenis).toHaveBeenCalledWith("01");
//     expect(result).toEqual(mockResponse);
//   });

//   // Add tests for other methods (getDokter, getKesadaran, etc.)
// });

// src/services/__tests__/PcareService.test.ts

import axios from "axios";
import MockAdapter from "axios-mock-adapter"; // Library untuk mocking HTTP request
import { AxiosResponse } from "axios";
import { PcareService } from "../services/pcare/pcare.service";
import { PcareConfig } from "./config";

// Setup mock axios
const mock = new MockAdapter(axios);

// Dummy config untuk PcareService

// Setup PcareService
const pcareService = new PcareService(PcareConfig);

// Mock data response dari BPJS
const mockDiagnosaResponse = {
  data: {
    response: [{ kode: "r51", nama: "Cholera" }],
  },
};

describe("PcareService", () => {
  // Test untuk `getDiagnosa`
  it("should fetch diagnosa data", async () => {
    // Mocking request ke BPJS PCare dengan response data
    // mock
    //   .onGet("https://apijkn.bpjs-kesehatan.go.id/pcare-rest/diagnosa/r51/0/10")
    //   .reply(200, mockDiagnosaResponse);

    const response = await pcareService.getDiagnosa("r51", 0, 10);

    // Validasi hasil response
    expect(response).toEqual(mockDiagnosaResponse.data);
    // expect(response.response).toHaveLength(2);
    // expect(response.response[0].kode).toBe("A00");
    // expect(response.response[0].nama).toBe("Cholera");
  });

  //   // Test jika endpoint tidak ditemukan
  //   it("should throw error if endpoint is not found", async () => {
  //     // Mocking error response
  //     mock
  //       .onGet(
  //         "https://apijkn.bpjs-kesehatan.go.id/pcare-rest-v3.0/diagnosa/A00/0/10"
  //       )
  //       .reply(404);

  //     // Menggunakan expect untuk menangkap error
  //     await expect(pcareService.getDiagnosa("A00", 0, 10)).rejects.toThrow(
  //       "Error in diagnosa: Request failed with status code 404"
  //     );
  //   });
});
