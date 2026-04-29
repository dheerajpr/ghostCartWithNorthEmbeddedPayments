import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

const SERVICEABLE_ZIPS = ['10001', '10002', '10003', '90210', '94105'];
const BOILER_SUPPORTED_ZIPS = ['10001', '10002', '10003']; // Boiler service only available in specific sectors (e.g., NYC)

// North API Configuration
const NORTH_API_URL_SESSIONS = 'https://checkout.north.com/api/sessions';
const NORTH_API_URL_STATUS = 'https://checkout.north.com/api/sessions/status'; // Endpoint for checking status

const {
  NORTH_API_KEY,
  NORTH_CHECKOUT_ID,
  NORTH_PROFILE_ID
} = process.env;

app.post('/api/sessions', async (req, res) => {
  const { zipCode, systemType } = req.body;

  if (!zipCode || !SERVICEABLE_ZIPS.includes(zipCode)) {
    console.warn(`Attempted service in non-serviceable zone: ${zipCode}`);
    return res.status(403).json({ error: 'Area not serviceable' });
  }

  // Boiler/Radiator specific proximity gate
  if (systemType === 'Boiler/Radiator' && !BOILER_SUPPORTED_ZIPS.includes(zipCode)) {
    console.warn(`Boiler service requested in unsupported zone: ${zipCode}`);
    return res.status(403).json({ error: 'Boiler/Radiator service not available in this sector' });
  }

  // Emergency Surge Logic
  const now = new Date();
  const hour = now.getHours();
  const isEmergency = hour < 9 || hour >= 17;
  const amount = isEmergency ? 199.00 : 75.00;

  try {
    // Attempt to create a real session with North Protocol
    if (NORTH_API_KEY && NORTH_CHECKOUT_ID && NORTH_PROFILE_ID) {
      console.log('Attempting to create North session...');
      const northResponse = await fetch(NORTH_API_URL_SESSIONS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${NORTH_API_KEY}`
        },
        body: JSON.stringify({
          checkoutId: NORTH_CHECKOUT_ID,
          profileId: NORTH_PROFILE_ID,
          amount: amount,
          products: [
            {
              name: isEmergency ? 'Emergency HVAC Dispatch' : 'Standard HVAC Dispatch',
              price: amount,
              quantity: 1
            }
          ]
        })
      });

      if (northResponse.ok) {
        const northData = await northResponse.json();
        console.log('Successfully created North session:', northData.token);
        return res.json({
          token: northData.token, // Real session token from North
          amount,
          isEmergency,
          serviceArea: 'Arctic Air North Zone'
        });
      }
      
      console.error('North API Error creating session:', await northResponse.text());
    }
  } catch (error) {
    console.error('Failed to communicate with North API for session creation:', error);
  }

  // Fallback to Mock Session for Hackathon Demo
  console.log('Using Mock Session Token (Development Mode)');
  const response = {
    token: `ghost_tk_${Math.random().toString(36).substr(2, 9)}`,
    amount,
    isEmergency,
    serviceArea: 'Arctic Air North Zone'
  };

  res.json(response);
});

// New endpoint to verify payment status with North API
app.post('/api/sessions/status', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    console.error('Missing session token in status request');
    return res.status(400).json({ error: 'Session token is required' });
  }

  // Fallback for development/hackathon if North API keys are not configured
  if (!NORTH_API_KEY) { 
      console.warn('NORTH_API_KEY not set. Using mock status.');
      // Mock response for development if keys are missing
      const mockStatus = Math.random() > 0.1 ? 'Approved' : 'Declined'; // 90% success rate for mock
      console.log(`Mock status for token ${token}: ${mockStatus}`);
      return res.json({ status: mockStatus });
  }

  try {
    console.log(`Verifying status for token: ${token}`);

    const options = {
      method: 'GET',
      headers: {
        CheckoutId: NORTH_CHECKOUT_ID,
        ProfileId: NORTH_PROFILE_ID,
        Authorization: `Bearer ${NORTH_API_KEY}`,
        SessionToken: token
      }
    }

    const northResponse = await fetch(`${NORTH_API_URL_STATUS}`, options as RequestInit);

    if (northResponse.ok) {
      const northData = await northResponse.json();
      res.json({ status: northData.status });
    } else {
      const errText = await northResponse.text();
      console.error('North API Error during status check:', northResponse.status, errText);
      res.status(northResponse.status).json({ error: 'Failed to get transaction status from North API' });
    }
  } catch (error) {
    console.error('Error verifying session status:', error);
    res.status(500).json({ error: 'Internal server error during verification' });
  }
});


app.listen(PORT, () => {
  console.log(`Gatekeeper server running on port ${PORT}`);
});
