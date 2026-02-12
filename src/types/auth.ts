export interface OtpRecord {
  otp: string;
  expiry: number;
  attemptsLeft: number;
}
export type OtpStorageMap = Record<string, OtpRecord>;

export type OtpValidationStatus =
  | "SUCCESS"
  | "INVALID_OTP"
  | "EXPIRED"
  | "ATTEMPTS_EXCEEDED"
  | "NOT_FOUND";


export interface OtpValidationResult {
  status: OtpValidationStatus;
  attemptsLeft?: number;
}
