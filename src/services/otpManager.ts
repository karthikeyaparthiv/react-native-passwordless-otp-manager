import {
  OTP_LENGTH,
  OTP_EXPIRY_MILLISECONDS,
  MAX_OTP_ATTEMPTS,
} from "../constants/config";
import {
  OtpStorageMap,
  OtpValidationResult,
} from "../types/auth";
import {
  getOtpStore,
  saveOtpStore,
} from "./storage";
import {
  logOtpGenerated,
  logOtpValidationFailure,
  logOtpValidationSuccess,
} from "./logger";

const generateRandomOtp = (): string => {
  let otp = "";

  for (let i = 0; i < OTP_LENGTH; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }

  return otp;
};

export const generateOtp = async (email: string): Promise<void> => {
  const otpStore = await getOtpStore();

  const newOtp = generateRandomOtp();

  otpStore[email] = {
    otp: newOtp,
    expiry: Date.now() + OTP_EXPIRY_MILLISECONDS,
    attemptsLeft: MAX_OTP_ATTEMPTS,
  };

  await saveOtpStore(otpStore);

  logOtpGenerated(email, newOtp);
};

export const validateOtp = async (
  email: string,
  enteredOtp: string
): Promise<OtpValidationResult> => {
  const otpStore = await getOtpStore();

  const record = otpStore[email];

  if (!record) {
    return { status: "NOT_FOUND" };
  }

  if (record.attemptsLeft <= 0) {
    logOtpValidationFailure(email, "ATTEMPTS_EXCEEDED");
    return { status: "ATTEMPTS_EXCEEDED" };
  }

  if (Date.now() > record.expiry) {
    logOtpValidationFailure(email, "EXPIRED");
    return { status: "EXPIRED" };
  }

  if (record.otp !== enteredOtp) {
    record.attemptsLeft -= 1;

    otpStore[email] = record;
    await saveOtpStore(otpStore);

    logOtpValidationFailure(email, "INVALID_OTP");

    return {
      status: "INVALID_OTP",
      attemptsLeft: record.attemptsLeft,
    };
  }

  logOtpValidationSuccess(email);

  delete otpStore[email];
  await saveOtpStore(otpStore);

  return { status: "SUCCESS" };
};
