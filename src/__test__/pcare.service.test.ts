// src/__test__/pcare.service.test.ts
import { PcareService } from "../services/pcare/pcare.service"; // Ensure correct import
import { FktpService } from "../services/fktp.service";
import { PcareConfig } from "./config";

// Mocking FktpService
jest.mock("../services/fktp.service", () => {
  return {
    FktpService: jest.fn().mockImplementation(() => {
      return {
        callEndpoint: jest.fn(),
        // Mocking getDiagnosa and other methods directly
        getDiagnosa: jest.fn(),
        getAlergiJenis: jest.fn(),
        getDokter: jest.fn(),
        getKesadaran: jest.fn(),
        getRujukanKunjungan: jest.fn(),
      };
    }),
  };
});

describe("PcareService", () => {
  let pcareService: PcareService;
  let mockCallEndpoint: jest.Mock;
  let mockGetDiagnosa: jest.Mock;
  let mockGetAlergiJenis: jest.Mock;

  beforeEach(() => {
    // Create the mock for axios client and other method mocks
    mockCallEndpoint = jest.fn();
    mockGetDiagnosa = jest.fn();
    mockGetAlergiJenis = jest.fn();

    // Mock implementation for the `FktpService` methods
    (FktpService as unknown as jest.Mock).mockImplementation(() => ({
      callEndpoint: mockCallEndpoint,
      getDiagnosa: mockGetDiagnosa,
      getAlergiJenis: mockGetAlergiJenis,
    }));

    // Create instance of PcareService
    pcareService = new PcareService({
      ...PcareConfig,
      /* your config here */
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call getDiagnosa and return correct response", async () => {
    const mockResponse = ["diagnosa1", "diagnosa2"];
    mockGetDiagnosa.mockResolvedValue(mockResponse);

    const result = await pcareService.getDiagnosa("code123", 0, 10);

    expect(mockGetDiagnosa).toHaveBeenCalledWith("code123", 0, 10);
    expect(result).toEqual(mockResponse);
  });
  ``;

  it("should call getAlergiJenis and return correct response", async () => {
    const mockResponse = ["alergi1", "alergi2"];
    mockGetAlergiJenis.mockResolvedValue(mockResponse);

    const result = await pcareService.getAlergiJenis("01");

    expect(mockGetAlergiJenis).toHaveBeenCalledWith("01");
    expect(result).toEqual(mockResponse);
  });

  // Add tests for other methods (getDokter, getKesadaran, etc.)
});
