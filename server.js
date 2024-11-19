const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cron = require('node-cron');
const axios = require('axios');

dotenv.config();

const app = express();
app.use(bodyParser.json());

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.post('/sendNotification', async (req, res) => {
  const { token, title, message } = req.body;

  const payload = {
    token: token,
    notification: {
      title: title,
      body: message,
    },
  };

  try {
    await admin.messaging().send(payload);
    res.status(200).send('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).send('Error sending notification');
  }
});


// cron.schedule('* * * * *', async () => {
//   try {
//     const response = await axios.get('https://zaaprazorpayserver.onrender.com');
//     console.log('Request to zaaprazorpayserver successful:', response.data);
//   } catch (error) {
//     console.error('Error making request to zaaprazorpayserver:', error);
//   }
// });
setInterval(async () => {
  try {
    const response = await axios.get('https://zaaprazorpayserver.onrender.com');
    console.log('Request to push notifications server successful:', response.data);
  } catch (error) {
    console.error('Error making request to razorpay server:', error);
  }
}, 45000);  // 45000ms = 45 seconds

setInterval(async () => {
  try {
    const response = await axios.get('https://zaap-mail-server-1.onrender.com');
    console.log('Request to push notifications server successful:', response.data);
  } catch (error) {
    console.error('Error making request to Mail server:', error);
  }
}, 45000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
