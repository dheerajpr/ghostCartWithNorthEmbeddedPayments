import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

const SERVICEABLE_ZIPS = ['10001', '10002', '10003', '90210', '94105'];

// North API Configuration
const NORTH_API_URL = 'https://checkout.north.com/api/sessions';
const { 
  NORTH_API_KEY, 
  NORTH_CHECKOUT_ID, 
  NORTH_PROFILE_ID 
} = process.env;

app.post('/api/sessions', async (req, res) => {
  const { zipCode } = req.body;

  if (!zipCode || !SERVICEABLE_ZIPS.includes(zipCode)) {
    return res.status(403).json({ error: 'Area not serviceable' });
  }

  // Emergency Surge Logic
  const now = new Date();
  const hour = now.getHours();
  const isEmergency = hour < 9 || hour >= 17;
  const amount = isEmergency ? 199.00 : 75.00;

  try {
    // Attempt to create a real session with North Protocol
    if (NORTH_API_KEY && NORTH_CHECKOUT_ID && NORTH_PROFILE_ID) {
      const northResponse = await fetch(NORTH_API_URL, {
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
        return res.json({
          token: northData.token,
          amount,
          isEmergency,
          serviceArea: 'Arctic Air North Zone'
        });
      }
      
      console.error('North API Error:', await northResponse.text());
    }
  } catch (error) {
    console.error('Failed to communicate with North API:', error);
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

app.listen(PORT, () => {
  console.log(`Gatekeeper server running on port ${PORT}`);
});
