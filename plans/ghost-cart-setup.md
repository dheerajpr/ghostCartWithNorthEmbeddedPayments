# Ghost Cart - Implementation Plan

Building a Qualification-First Checkout Engine for Arctic Air HVAC.

## Objective
Create a checkout system where the payment UI ("Ghost State") is only revealed after a user qualifies via address verification. The payment status is then verified server-side before showing confirmation.

## Key Files & Context
- `server/`: Node.js/Express backend for session management, surge pricing, and North API interaction.
- `client/`: React/TypeScript frontend for the "Cyberpunk-meets-Apple" UI.
- `shared/`: Shared types for session requests/responses. (NOTE: Removed in final code for simplicity, but would be ideal in a larger project).

## Implementation Steps

### 1. Project Initialization
- Initialize a monorepo structure using Vite for client and Express/TS for server.
- Set up Tailwind CSS for styling.
- Install core dependencies: `express`, `cors`, `dotenv`, `framer-motion`, `lucide-react`, `typescript`, `ts-node`, `nodemon` (for server dev), `vite` (for client dev).

### 2. Backend Development (`server/`)
- **`/api/sessions` Endpoint**:
    - Validates Zip code against a mock service area.
    - Calculates pricing based on server time ($75 Standard vs. $199 Emergency).
    - **North API Integration**: Calls `POST https://checkout.north.com/api/sessions` to get a session token.
    - Includes fallback to a mock token if North API keys are missing or unreachable.
- **`/api/sessions/status` Endpoint**:
    - Receives a session token from the frontend after payment attempt.
    - Calls North API `GET https://checkout.north.com/api/sessions/status?token=<sessionToken>` to get the definitive transaction status.
    - Returns the status (`Approved`, `Declined`) to the frontend.

### 3. Frontend Development (`client/`)
- **Theme & Global Styles**:
    - Dark mode background, Neon Cyan (#00E5FF) accents, glassmorphism, and Cyberpunk aesthetic.
- **Components**:
    - `Hero`: Branded Arctic Air HVAC header.
    - `AddressGate`: Handles address input and mock North Autocomplete events, triggering validation.
    - `GhostCheckout`:
        - Renders the North Embedded Checkout iFrame using `checkout.mount()`.
        - **Payment Completion Flow**:
            - Listens for `onPaymentComplete` SDK event.
            - On event, sends the received `token` to the backend's `/api/sessions/status` endpoint.
            - Updates UI based on backend verification (`paymentStatus` state).
    - `WaitlistForm`: Lead-gen form for unserviceable areas.

### 4. Integration & Logic
- **Ghost Gate Transition**: Address selection triggers validation, backend session creation, then `checkout.mount()`.
- **Status Verification**: Backend verifies payment status via North API before frontend confirmation display.

## Verification & Testing
- **Proximity Gate**: Test valid/invalid zip codes.
- **Emergency Surge**: Verify price changes based on simulated time.
- **Payment Flow**: Test successful payment (mocked or with test credentials), declined payment, and waitlist path.
- **UI/UX**: Ensure "Cyberpunk-meets-Apple" vibe and smooth animations.
- **Docker**: Test local Docker setup (`docker-compose up`).

## Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React.
- **Backend**: Node.js, Express, TypeScript, `node-fetch` (built-in).
- **DevOps**: Docker, Docker Compose.
