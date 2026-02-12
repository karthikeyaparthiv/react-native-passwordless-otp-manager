type LogEvent =
  | "OTP_GENERATED"
  | "OTP_VALIDATION_SUCCESS"
  | "OTP_VALIDATION_FAILURE"
  | "LOGOUT";

interface LogPayload {
  email?: string;
  metadata?: Record<string, unknown>;
}

const log = (event: LogEvent, payload?: LogPayload) => {
  const timestamp = new Date().toISOString();

  console.log(
    `[${timestamp}] [${event}]`,
    payload ? JSON.stringify(payload) : ""
  );
};

export const logOtpGenerated = (email: string, otp: string) => {
  log("OTP_GENERATED", {
    email,
    metadata: { otp },
  });
};

export const logOtpValidationSuccess = (email: string) => {
  log("OTP_VALIDATION_SUCCESS", { email });
};

export const logOtpValidationFailure = (
  email: string,
  reason: string
) => {
  log("OTP_VALIDATION_FAILURE", {
    email,
    metadata: { reason },
  });
};

export const logLogout = (email: string) => {
  log("LOGOUT", { email });
};
