export class BpjsError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public originalError?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      ...(this.originalError && { details: this.originalError }),
    };
  }
}

/**
 * Error untuk endpoint tidak ditemukan
 */
export class BpjsEndpointNotFoundError extends BpjsError {
  constructor(endpointName: string) {
    super(
      `Endpoint '${endpointName}' tidak ditemukan`,
      "ENDPOINT_NOT_FOUND",
      404
    );
  }
}

export class BpjsCacheError extends BpjsError {
  constructor(message: string, originalError?: any) {
    super(message, "CACHE_ERROR", 500, originalError);
  }
}
export class BpjsDecryptionError extends BpjsError {
  constructor(
    message: string = "Gagal mendekripsi response BPJS",
    originalError?: any
  ) {
    super(message, "DECRYPTION_ERROR", 500, originalError);
  }
}

export class BpjsErrorFactory {
  static fromAxios(error: any): BpjsError {
    return new BpjsError(
      error.message || "Terjadi kesalahan pada request",
      error.code || "BPJS_BRIDGE_ERROR",
      error.status || 500,
      error
    );
  }
}
