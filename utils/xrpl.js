import * as xrpl from 'xrpl';

// Get network URL based on selection
export const getNetworkUrl = (selectedNetwork) => {
  return selectedNetwork === 'testnet' 
    ? 'wss://s.altnet.rippletest.net:51233/' 
    : 'wss://s.devnet.rippletest.net:51233/';
};

// Get new account from faucet
export const getNewAccountFromFaucet = async (networkUrl) => {
  const client = new xrpl.Client(networkUrl);
  
  try {
    await client.connect();
    const faucetHost = null;
    const { wallet } = await client.fundWallet(null, { faucetHost });
    
    return {
      success: true,
      data: {
        address: wallet.address,
        seed: wallet.seed
      },
      message: `New account created!\nAddress: ${wallet.address}\nSeed: ${wallet.seed}`
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: `Error: ${error.message}`
    };
  } finally {
    await client.disconnect();
  }
};

// Get account from seed
export const getAccountFromSeed = async (seed, networkUrl) => {
  const client = new xrpl.Client(networkUrl);
  
  try {
    await client.connect();
    const wallet = xrpl.Wallet.fromSeed(seed);
    const address = wallet.address;
    
    return {
      success: true,
      data: {
        address: address
      },
      message: `Wallet found.\nAccount address: ${address}`
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: `Error: ${error.message}`
    };
  } finally {
    await client.disconnect();
  }
};

// Create trust line
export const createTrustLine = async (config, networkUrl) => {
  const { trustlineLimit, destination, currency, standbyAccountSeed } = config;
  const client = new xrpl.Client(networkUrl);
  
  try {
    await client.connect();
    const standby_wallet = xrpl.Wallet.fromSeed(standbyAccountSeed);
    
    const trustSet = {
      TransactionType: "TrustSet",
      Account: standby_wallet.address,
      LimitAmount: {
        currency: currency,
        issuer: destination,
        value: trustlineLimit
      }
    };
    
    const prepared = await client.autofill(trustSet);
    const signed = standby_wallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);
    
    if (result.result.meta.TransactionResult === "tesSUCCESS") {
      return {
        success: true,
        data: result.result,
        message: `Trust line created successfully!\nLimit: ${trustlineLimit}\nCurrency: ${currency}\nIssuer: ${destination}`
      };
    } else {
      return {
        success: false,
        error: result.result.meta.TransactionResult,
        message: `Error creating trust line: ${result.result.meta.TransactionResult}`
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: `Error: ${error.message}`
    };
  } finally {
    await client.disconnect();
  }
};

// Configure account (Allow Rippling)
export const configureAccount = async (operationalAccountSeed, networkUrl) => {
  const client = new xrpl.Client(networkUrl);
  
  try {
    await client.connect();
    const operational_wallet = xrpl.Wallet.fromSeed(operationalAccountSeed);
    
    const accountSet = {
      TransactionType: "AccountSet",
      Account: operational_wallet.address,
      SetFlag: 8 // asfDefaultRipple
    };
    
    const prepared = await client.autofill(accountSet);
    const signed = operational_wallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);
    
    if (result.result.meta.TransactionResult === "tesSUCCESS") {
      return {
        success: true,
        data: result.result,
        message: `Operational account configured successfully!\nAllow Rippling: Enabled`
      };
    } else {
      return {
        success: false,
        error: result.result.meta.TransactionResult,
        message: `Error configuring account: ${result.result.meta.TransactionResult}`
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: `Error: ${error.message}`
    };
  } finally {
    await client.disconnect();
  }
};

// Issue tokens (Send Currency)
export const issueTokens = async (config, networkUrl) => {
  const { amount, destination, currency, operationalAccountSeed } = config;
  const client = new xrpl.Client(networkUrl);
  
  try {
    await client.connect();
    const operational_wallet = xrpl.Wallet.fromSeed(operationalAccountSeed);
    
    const payment = {
      TransactionType: "Payment",
      Account: operational_wallet.address,
      Destination: destination,
      Amount: {
        currency: currency,
        issuer: operational_wallet.address,
        value: amount
      }
    };
    
    const prepared = await client.autofill(payment);
    const signed = operational_wallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);
    
    if (result.result.meta.TransactionResult === "tesSUCCESS") {
      return {
        success: true,
        data: result.result,
        message: `Tokens issued successfully!\nAmount: ${amount}\nCurrency: ${currency}\nFrom: ${operational_wallet.address}\nTo: ${destination}`
      };
    } else {
      return {
        success: false,
        error: result.result.meta.TransactionResult,
        message: `Error issuing tokens: ${result.result.meta.TransactionResult}`
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: `Error: ${error.message}`
    };
  } finally {
    await client.disconnect();
  }
};

// Check AMM
export const checkAMM = async (config, networkUrl) => {
  const { asset1Currency, asset1Issuer, asset2Currency, asset2Issuer } = config;
  const client = new xrpl.Client(networkUrl);
  
  try {
    await client.connect();
    
    let amm_info_request = null;
    
    // Format the amm_info command based on the combination of XRP and tokens
    if (asset1Currency === 'XRP') {
      amm_info_request = {
        "command": "amm_info",
        "asset": {
          "currency": "XRP"
        },
        "asset2": {
          "currency": asset2Currency,
          "issuer": asset2Issuer
        },
        "ledger_index": "validated"
      };
    } else if (asset2Currency === 'XRP') {
      amm_info_request = {
        "command": "amm_info",
        "asset": {
          "currency": asset1Currency,
          "issuer": asset1Issuer
        },
        "asset2": {
          "currency": "XRP"
        },
        "ledger_index": "validated"
      };
    } else {
      amm_info_request = {
        "command": "amm_info",
        "asset": {
          "currency": asset1Currency,
          "issuer": asset1Issuer
        },
        "asset2": {
          "currency": asset2Currency,
          "issuer": asset2Issuer
        },
        "ledger_index": "validated"
      };
    }
    
    const amm_info_result = await client.request(amm_info_request);
    
    return {
      success: true,
      data: amm_info_result.result.amm,
      message: `AMM Found!\n\n${JSON.stringify(amm_info_result.result.amm, null, 2)}`
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: `AMM not found or error: ${error.message}`
    };
  } finally {
    await client.disconnect();
  }
};

// Create AMM
export const createAMM = async (config, networkUrl) => {
  const { 
    asset1Currency, 
    asset1Issuer, 
    asset1Amount, 
    asset2Currency, 
    asset2Issuer, 
    asset2Amount, 
    standbyAccountSeed 
  } = config;
  
  const client = new xrpl.Client(networkUrl);
  
  try {
    await client.connect();
    const standby_wallet = xrpl.Wallet.fromSeed(standbyAccountSeed);
    
    // AMMCreate requires burning one owner reserve
    const ss = await client.request({"command": "server_state"});
    const amm_fee_drops = ss.result.state.validated_ledger.reserve_inc.toString();
    
    let ammCreate = null;
    
    // Format the AMMCreate transaction based on the combination of XRP and tokens
    if (asset1Currency === 'XRP') {
      ammCreate = {
        "TransactionType": "AMMCreate",
        "Account": standby_wallet.address,
        "Amount": (parseFloat(asset1Amount) * 1000000).toString(), // convert XRP to drops
        "Amount2": {
          "currency": asset2Currency,
          "issuer": asset2Issuer,
          "value": asset2Amount
        },
        "TradingFee": 500, // 500 = 0.5%
        "Fee": amm_fee_drops
      };
    } else if (asset2Currency === 'XRP') {
      ammCreate = {
        "TransactionType": "AMMCreate",
        "Account": standby_wallet.address,
        "Amount": {
          "currency": asset1Currency,
          "issuer": asset1Issuer,
          "value": asset1Amount
        },
        "Amount2": (parseFloat(asset2Amount) * 1000000).toString(), // convert XRP to drops
        "TradingFee": 500, // 500 = 0.5%
        "Fee": amm_fee_drops
      };
    } else {
      ammCreate = {
        "TransactionType": "AMMCreate",
        "Account": standby_wallet.address,
        "Amount": {
          "currency": asset1Currency,
          "issuer": asset1Issuer,
          "value": asset1Amount
        },
        "Amount2": {
          "currency": asset2Currency,
          "issuer": asset2Issuer,
          "value": asset2Amount
        },
        "TradingFee": 500, // 500 = 0.5%
        "Fee": amm_fee_drops
      };
    }
    
    const prepared_create = await client.autofill(ammCreate);
    const signed_create = standby_wallet.sign(prepared_create);
    const amm_create = await client.submitAndWait(signed_create.tx_blob);
    
    if (amm_create.result.meta.TransactionResult === "tesSUCCESS") {
      return {
        success: true,
        data: {
          transaction: amm_create.result,
          preparedTransaction: prepared_create
        },
        message: `AMM created successfully!`,
        preparedTransactionMessage: `Prepared transaction:\n${JSON.stringify(prepared_create, null, 2)}`
      };
    } else {
      return {
        success: false,
        error: amm_create.result.meta.TransactionResult,
        message: `Error creating AMM: ${amm_create.result.meta.TransactionResult}`
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: `Error: ${error.message}`
    };
  } finally {
    await client.disconnect();
  }
}; 