import type { NextApiRequest, NextApiResponse } from 'next';
import dotenv from 'dotenv';
dotenv.config();

const MARQETA_URL = 'https://sandbox-api.marqeta.com/v3';
const CARD_PRODUCT_TOKEN = '53828f2d-0c49-4954-90b7-13fc2b7f95d7';

// Re-construct the auth header using your environment variables
const auth = 'Basic ' + Buffer.from(
  `${process.env.MARQETA_APP_TOKEN}:${process.env.MARQETA_ACCESS_TOKEN}`
).toString('base64');

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  // We only want to handle POST requests to this endpoint
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { firstName, lastName, email, walletAddress, password } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !walletAddress || !password) {
      return res.status(400).json({ error: 'First name, last name, email, wallet address, and password are required.' });
    }
    
    if (typeof password !== 'string' || !/^\d{6}$/.test(password)) {
      return res.status(400).json({ error: 'Password must be a 6-digit number.' });
    }

    let cardholderToken;

    // Check if a user with the specified email already exists
    const userSearchResponse = await fetch(`${MARQETA_URL}/users?email=${encodeURIComponent(email)}&count=1&fields=token`, {
        headers: {
            'Authorization': auth
        }
    });
    
    if (!userSearchResponse.ok) {
        const errorBody = await userSearchResponse.text();
        console.error("Marqeta User Search API Error:", errorBody);
        return res.status(userSearchResponse.status).json({
            error: `Failed to search for user: ${errorBody}`
        });
    }

    const userSearchData = await userSearchResponse.json();

    if (userSearchData.count > 0 && userSearchData.data && userSearchData.data.length > 0) {
        cardholderToken = userSearchData.data[0].token;
    } else {
        // If no user is found, create a new one
        const cardholderPayload = {
          first_name: firstName,
          last_name: lastName,
          email: email,
          active: true
        };
    
        const cardholderRes = await fetch(`${MARQETA_URL}/users`, {
          method: 'POST',
          headers: {
            'Authorization': auth,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(cardholderPayload)
        });
    
        const responseData = await cardholderRes.json();
    
        if (!cardholderRes.ok) {
          console.error("Marqeta API Error creating user:", responseData);
          return res.status(cardholderRes.status).json({ 
            error: `Failed to create cardholder: ${responseData.error_message || JSON.stringify(responseData)}` 
          });
        }
        cardholderToken = responseData.token;
    }
    
    // --- Create Card Step ---
    const cardCreationPayload = {
      card_product_token: CARD_PRODUCT_TOKEN,
      user_token: cardholderToken,
      token: (walletAddress + password).substring(5, 33)
    };

    const cardCreationRes = await fetch(`${MARQETA_URL}/cards`, {
      method: 'POST',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cardCreationPayload)
    });

    const cardCreationBody = await cardCreationRes.text();
    const cardCreationData = cardCreationBody ? JSON.parse(cardCreationBody) : {};

    if (!cardCreationRes.ok) {
      console.error("Marqeta Card Creation API Error:", cardCreationData);
      return res.status(cardCreationRes.status).json({
        error: `Failed to create card: ${cardCreationData.error_message || JSON.stringify(cardCreationData)}`
      });
    }
    
    const cardToken = cardCreationData.token;

    // Get PAN (card number) and CVV
    const panRes = await fetch(`${MARQETA_URL}/cards/${cardToken}/showpan`, {
      method: 'GET',
      headers: { 'Authorization': auth }
    });

    let panData = {};
    if (panRes.ok) {
      panData = await panRes.json();
    } else {
      console.error("Marqeta Show PAN API Error:", await panRes.text());
      // We don't fail the whole request, but PAN/CVV will be missing
    }

    // On success, return the new card's data
    return res.status(201).json({ 
      success: true,
      cardholder: {
        token: cardholderToken,
        firstName,
        lastName,
        email
      },
      card: {
        token: cardToken,
        lastFour: cardCreationData.last_four,
        expiration: cardCreationData.expiration,
        state: cardCreationData.state,
        pan: (panData as any).pan || null,
        cvv: (panData as any).cvv_number || null
      }
    });

  } catch (error) {
    console.error('Internal Server Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
