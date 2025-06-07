import type { NextApiRequest, NextApiResponse } from 'next';
import dotenv from 'dotenv';
dotenv.config();

const MARQETA_URL = 'https://sandbox-api.marqeta.com/v3';

const auth = 'Basic ' + Buffer.from(
  `${process.env.MARQETA_APP_TOKEN}:${process.env.MARQETA_ACCESS_TOKEN}`
).toString('base64');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { card_token, amount } = req.body;

    if (!card_token || !amount) {
      return res.status(400).json({ error: 'card_token and amount are required.' });
    }

    const transactionPayload = {
      amount: amount.toString(),
      card_token: card_token,
      mid: "123456890",  // Merchant ID at top level
      card_acceptor: {
        name: "Test Merchant",
        mcc: "5999"  // Miscellaneous retail stores
      }
    };

    console.log('Simulating transaction with payload:', transactionPayload);

    const transactionRes = await fetch(`${MARQETA_URL}/simulate/authorization`, {
      method: 'POST',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transactionPayload)
    });

    const responseData = await transactionRes.json();
    console.log('Authorization response:', responseData);

    if (!transactionRes.ok) {
      console.error("Marqeta Transaction API Error:", responseData);
      return res.status(transactionRes.status).json({
        error: `Failed to create transaction: ${responseData.error_message || JSON.stringify(responseData)}`
      });
    }

    return res.status(201).json({ 
      success: true, 
      transaction: {
        token: responseData.transaction?.token || responseData.token,
        amount: responseData.transaction?.amount || responseData.amount,
        status: responseData.transaction?.state || responseData.state,
        merchant: "Test Merchant"
      }
    });

  } catch (error) {
    console.error('Internal Server Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 