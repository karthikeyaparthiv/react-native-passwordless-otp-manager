# Passwordless Authentication App (React Native + Expo)

## Overview

This project implements a passwordless authentication flow using:

* Email + OTP login

* Session tracking with live duration

* AsyncStorage for local persistence

* Clean separation of UI, business logic, and side effects

* No backend is used — all logic is implemented locally.

## Setup Instructions

1. Clone the repository and change directory

   ```bash
   cd passwordless-auth-app
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the app

   ```bash
   npx expo start -c
   ```

4. Run on device (Ensure that phone and laptop must be on same WiFi)

scan QR using Expo Go app after starting the app

## OTP Logic & Expiry Handling

*OTP Generation*

When user taps Send OTP:

* A 6-digit numeric OTP is generated locally

* Expiry timestamp = Date.now() + 60 seconds

* Attempts are reset to 3

* OTP is stored per email in AsyncStorage

*OTP Validation*

On OTP submission:

1. Check if OTP exists for email

2. Check if attempts are exceeded

3. Check if OTP is expired

4. Compare entered OTP with stored OTP

*Expiry Handling*

* Expiry is stored as a timestamp (milliseconds)

* Validation checks:

```Date.now() > record.expiry```

This ensures expiry works even if:

* Countdown UI is manipulated

* App goes to background

* Device time changes

*Resend OTP*

When user taps *Resend OTP*:

* Old OTP is overwritten

* Attempts reset to 3

* Expiry reset to 60 seconds

## Data Structures Used & Why

*OTP Record*

```
interface OtpRecord {
  otp: string;
  expiry: number;
  attemptsLeft: number;
}
```

*Why?*

* otp → stores generated code

* expiry → timestamp allows easy comparison

* attemptsLeft → tracks validation attempts

*OTP Storage Map*

```type OtpStorageMap = Record<string, OtpRecord>;```


Example:

```
{
  "user1@email.com": {...},
  "user2@email.com": {...}
}
```

*Why?*

* Ensures OTP is stored per email

* Avoids global mutable variables

* Easily scalable for multiple users

## Session Handling

On successful login:

* Session start timestamp is stored in AsyncStorage

* useSessionTimer calculates duration using:

```Date.now() - startTimestamp```

*Why This Approach?*

* Timer does not reset on re-render

* Survives app background/foreground

* No memory leaks

* Uses useRef to prevent duplicate intervals

## External SDK Used

*React Native AsyncStorage*

*Why Chosen?*

* Allows local persistence without backend

* Lightweight and reliable

* Suitable for storing:

- OTP data

- Session start timestamp

*How It Is Used*

* Wrapped inside storage.ts

* No direct AsyncStorage calls inside UI

* Centralized persistence layer

This ensures clean architecture and easy maintainability.

## Architecture & Separation of Concerns

```
app/                → Routing + Screens (UI only)
src/services/       → Business logic + storage + logging
src/hooks/          → Reusable session timer logic
src/types/          → Type definitions
src/constants/      → Config values
```

*Key Principles Followed*

* No business logic inside JSX

* No global mutable variables

* No setInterval leaks

* Clean dependency arrays

* Side effects separated (logger.ts)

* AsyncStorage wrapped in service layer

## What I Understood and Implemented

* Through this assignment, I demonstrated understanding of:

* File-based routing using Expo Router

* TypeScript type modeling for authentication flows

* Designing OTP systems with expiry and attempt tracking

* Avoiding global state by using AsyncStorage properly

* Implementing session timers without memory leaks

* Using useRef, useEffect, and useCallback correctly

* Handling app background/foreground transitions

* Maintaining clean separation between:

- UI

- Business logic

- Side effects

I ensured:

* No logic buried inside render blocks

* No unnecessary re-renders

* Proper cleanup of intervals

* Clear modular structure

