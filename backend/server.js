const express = require('express');
const bodyParser = require('body-parser');
const Twilio = require('twilio');
const admin = require('firebase-admin');

const app = express();
const port = 3001; // Change this to your preferred port

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const twilioClient = Twilio('TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN');

app.use(bodyParser.json());
app.use(cors());

// Endpoint to send SMS
app.post('/api/send-sms', async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    await twilioClient.messages.create({
      body: 'You have been registered. Please enter your password in the app.',
      from: 'YOUR_TWILIO_PHONE_NUMBER',
      to: phoneNumber,
    });
    res.status(200).send('SMS sent');
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).send('Error sending SMS');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
