import type { NextApiRequest, NextApiResponse } from 'next';
import dotenv from 'dotenv';
import { Client, Wallet } from "xrpl";
dotenv.config();

const MARQETA_URL = 'https://sandbox-api.marqeta.com/v3';

const auth = 'Basic ' + Buffer.from(
  `${process.env.MARQETA_APP_TOKEN}:${process.env.MARQETA_ACCESS_TOKEN}`
).toString('base64');

// XRPL pathfinding function
async function executeXRPLPathfinding(amount: number) {
  const client = new Client("wss://s.altnet.rippletest.net:51233/");
  
  try {
    await client.connect();
    console.log("Connected to XRPL Testnet for pathfinding");

    // Initialize the wallets from environment variables
    const sourceWallet = Wallet.fromSeed(process.env.SOURCE_WALLET_SEED || "");
    const destinationWallet = Wallet.fromSeed(process.env.DESTINATION_WALLET_SEED || "");

    console.log("Source Wallet Address:", sourceWallet.classicAddress);
    console.log("Destination Wallet Address:", destinationWallet.classicAddress);

    // Convert USD amount to XRP drops (1 XRP = 1,000,000 drops)
    const xrpAmount = Math.floor(amount * 100000).toString(); // Convert USD to drops roughly

    const pathfindRequest = {
      command: "ripple_path_find",
      source_account: sourceWallet.classicAddress,
      destination_account: destinationWallet.classicAddress,
      destination_amount: xrpAmount,
      source_currencies: [{
        currency: "524C555344000000000000000000000000000000", // RLUSD
        issuer: "rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV" // RLUSD issuer
      }],
      ledger_index: "validated"
    };

    console.log("Starting RLUSD → XRP pathfinding...");
    console.log("Destination amount (XRP drops):", xrpAmount);
    
    const paths = await client.request(pathfindRequest);
    console.log('Available Paths:', paths.result.alternatives);

    if (paths.result.alternatives && paths.result.alternatives.length > 0) {
      // Use the first available path
      const selectedPath = paths.result.alternatives[0];
      console.log("Selected path:", selectedPath);
      console.log("Source amount needed (RLUSD):", selectedPath.source_amount);

      const paymentTransaction = {
        TransactionType: "Payment",
        Account: sourceWallet.classicAddress,
        Destination: destinationWallet.classicAddress,
        Amount: xrpAmount,
        SendMax: selectedPath.source_amount,
        Paths: selectedPath.paths_computed
      };

      console.log("Executing RLUSD → XRP payment...");
      
      const response = await client.submitAndWait(paymentTransaction, { 
        autofill: true, 
        wallet: sourceWallet 
      });
      
      console.log('XRPL Transaction Result:', response.result.meta.TransactionResult);
      console.log('XRPL Transaction Hash:', response.result.hash);
      
      return {
        success: response.result.meta.TransactionResult === "tesSUCCESS",
        hash: response.result.hash,
        result: response.result.meta.TransactionResult,
        sourceAmount: selectedPath.source_amount,
        destinationAmount: xrpAmount
      };

    } else {
      console.log("No paths found for RLUSD → XRP");
      return {
        success: false,
        error: "No pathfinding routes available",
        message: "RLUSD → XRP market may not be active on testnet"
      };
    }

  } catch (error) {
    console.error('Error during XRPL pathfinding:', error);
    return {
      success: false,
      error: error.message || "XRPL pathfinding failed"
    };
  } finally {
    await client.disconnect();
    console.log("Disconnected from XRPL");
  }
}

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

    // Step 1: Execute Marqeta transaction simulation
    const transactionPayload = {
      amount: amount.toString(),
      card_token: card_token,
      mid: "123456890",
      card_acceptor: {
        name: "Test Merchant",
        mcc: "5999"
      }
    };

    console.log('Simulating Marqeta transaction with payload:', transactionPayload);

    const transactionRes = await fetch(`${MARQETA_URL}/simulate/authorization`, {
      method: 'POST',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transactionPayload)
    });

    const responseData = await transactionRes.json();
    console.log('Marqeta Authorization response:', responseData);

    if (!transactionRes.ok) {
      console.error("Marqeta Transaction API Error:", responseData);
      return res.status(transactionRes.status).json({
        error: `Failed to create Marqeta transaction: ${responseData.error_message || JSON.stringify(responseData)}`
      });
    }

    // Step 2: Execute XRPL pathfinding (only if environment variables are set)
    let xrplResult = null;
    if (process.env.SOURCE_WALLET_SEED && process.env.DESTINATION_WALLET_SEED) {
      console.log('Executing XRPL pathfinding...');
      xrplResult = await executeXRPLPathfinding(parseFloat(amount));
    } else {
      console.log('XRPL wallet seeds not configured, skipping pathfinding');
      xrplResult = {
        success: false,
        error: "XRPL wallet seeds not configured"
      };
    }

    // Return combined results
    return res.status(201).json({ 
      success: true, 
      transaction: {
        token: responseData.transaction?.token || responseData.token,
        amount: responseData.transaction?.amount || responseData.amount,
        status: responseData.transaction?.state || responseData.state,
        merchant: "Test Merchant"
      },
      xrpl: xrplResult
    });

  } catch (error) {
    console.error('Internal Server Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 