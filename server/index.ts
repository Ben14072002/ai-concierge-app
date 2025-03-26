import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

app.use(cors());
app.use(express.json());

// Erstelle eine Payment Intent
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, booking } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        booking: JSON.stringify(booking)
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Fehler beim Erstellen der Payment Intent:', error);
    res.status(500).json({ error: 'Fehler bei der Zahlungsabwicklung' });
  }
});

// Bestätige die Zahlung
app.post('/api/confirm-payment', async (req, res) => {
  try {
    const { clientSecret, paymentMethodId } = req.body;

    const paymentIntent = await stripe.paymentIntents.confirm(clientSecret, {
      payment_method: paymentMethodId
    });

    res.json(paymentIntent);
  } catch (error) {
    console.error('Fehler bei der Zahlungsbestätigung:', error);
    res.status(500).json({ error: 'Fehler bei der Zahlungsbestätigung' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
}); 