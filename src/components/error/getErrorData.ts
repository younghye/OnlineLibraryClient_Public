type ErrorCodeType = {
  [key: string]: { code: string; message: string; requireLogin?: boolean };
};

const ERROR_CODE: ErrorCodeType = {
  default: { code: "ERROR", message: "An unknown error has occurred." },

  // axios error
  ERR_NETWORK: {
    code: "ERR_NETWORK",
    message: "Problem with the network connection.",
  },
  ECONNABORTED: {
    code: "ECONNABORTED",
    message: "Request timed out.",
  },
  ERR_JWT_EXPIRED: {
    code: "ERR_JWT_EXPIRED",
    message: "'Expiration Time.",
  },

  // http status code
  302: { code: "302", message: "Redirect" },
  400: { code: "400", message: "Bad Request" },
  401: { code: "401", message: "Unauthorized", requireLogin: true },
  403: { code: "403", message: "Forbidden" },
  404: { code: "404", message: "NotFound" },
  408: { code: "408", message: "Request Timeout" },
  409: { code: "409", message: "Conflict" },
  500: { code: "500", message: "InternalServerError" },
} as const;

export const getErrorData = (error: any) => {
  const serverErrorCode = error?.response?.data?.code ?? "";
  const httpErrorCode = error?.response?.status ?? "";
  const axiosErrorCode = error?.code ?? "";
  const customErrorCode = error?.status ?? "";

  //  when API Service error message is an empty, display global error message.
  if (
    httpErrorCode &&
    error.response.data &&
    typeof error.response.data == "string"
  )
    return {
      code: httpErrorCode,
      message: error.response.data,
      requireLogin: false,
    };

  if (serverErrorCode in ERROR_CODE) {
    return ERROR_CODE[serverErrorCode as keyof typeof ERROR_CODE];
  }
  if (httpErrorCode in ERROR_CODE) {
    return ERROR_CODE[httpErrorCode as keyof typeof ERROR_CODE];
  }
  if (axiosErrorCode in ERROR_CODE) {
    return ERROR_CODE[axiosErrorCode as keyof typeof ERROR_CODE];
  }
  if (customErrorCode in ERROR_CODE) {
    return ERROR_CODE[customErrorCode as keyof typeof ERROR_CODE];
  }
  return ERROR_CODE.default;
};
