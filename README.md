# 👻 Ghost Cart

A qualification-first checkout engine powered by **North Payments**. Ghost Cart ensures you only collect payments from serviceable customers through a "Ghost Gate" verification system.

## 🚀 Mission
In high-stakes service industries, taking a payment from an unserviceable customer is a liability. Ghost Cart uses North’s Embedded Checkout as a reward for qualification. The payment UI remains in a "Ghost State" (hidden) until business rules—verified via address verification—are met.


## 🛠️ Architecture
- **Frontend**: React (TypeScript), Tailwind CSS, Framer Motion, North JavaScript SDK.
- **Backend**: Node.js (Express), North Embedded checkout API.
- **DevOps**: Docker & Docker Compose ready.

## 🏃 Getting Started

### 🐳 Run with Docker (Recommended)
From the project root:
```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3004`

### 💻 Run Locally

#### 1. Setup Server
```bash
cd server
cp .env.example .env
# Add your NORTH_API_KEY, NORTH_CHECKOUT_ID, NORTH_PROFILE_ID
npm install
npm run dev
```

#### 2. Setup Client
```bash
cd client
npm install
npm run dev
```

## 🧪 Demo Validation
1. **Pass Proximity Gate**: Enter Zip `10001` or `90210`.
2. **Unlock Animation**: Watch the "Shield Reveal" as the North iFrame mounts.
3. **Fail Proximity Gate**: Enter any other Zip to see the "Waitlist" lead-gen form.

---
