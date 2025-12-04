export {};

declare global {
  interface BPJSResponse<T> {
    metaData: MetaData;
    response: T;
  }

  type DataObject<T> = T;

  type DataArray<T> = {
    list: Array<T>;
  };
  type DataPaginate<T> = {
    count: number;
    list: Array<T>;
  };

  type BridgeErrorType =
    | "VALIDATION_ERROR"
    | "NOT_FOUND_ERROR"
    | "NO_CONTENT"
    | "UNKNOWN_ERROR";
}

interface MetaData {
  code: number;
  message: string;
}
