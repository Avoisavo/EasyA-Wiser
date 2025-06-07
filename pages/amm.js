import { useState, useEffect } from 'react';
import Head from 'next/head';
import * as xrpl from 'xrpl';

export default function AMM() {
  // Network selection
  const [selectedNetwork, setSelectedNetwork] = useState('devnet');
  
  // Account states
  const [standbyAccount, setStandbyAccount] = useState({
    name: '',
    address: '',
    seed: ''
  });
  
  const [operationalAccount, setOperationalAccount] = useState({
    name: '',
    address: '',
    seed: ''
  });
  
  // AMM Asset states
  const [asset1Currency, setAsset1Currency] = useState('');
  const [asset1Issuer, setAsset1Issuer] = useState('');
  const [asset1Amount, setAsset1Amount] = useState('');
  
  const [asset2Currency, setAsset2Currency] = useState('');
  const [asset2Issuer, setAsset2Issuer] = useState('');
  const [asset2Amount, setAsset2Amount] = useState('');
  
  // Form states
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('');
  const [currency, setCurrency] = useState('');
  const [trustlineLimit, setTrustlineLimit] = useState('');
  
  // Results and loading
  const [results, setResults] = useState('');
  const [ammInfo, setAmmInfo] = useState('');
  const [loading, setLoading] = useState(false);

  // Get network URL
  const getNetworkUrl = () => {
    return selectedNetwork === 'testnet' 
      ? 'wss://s.altnet.rippletest.net:51233/' 
      : 'wss://s.devnet.rippletest.net:51233/';
  };

  // Get new account from faucet
  const getNewAccount = async (accountType) => {
    setLoading(true);
    const net = getNetworkUrl();
    const client = new xrpl.Client(net);
    
    try {
      await client.connect();
      setResults(`===Getting ${accountType} Account===\n\nConnected to ${net}.`);
      
      const faucetHost = null;
      const { wallet } = await client.fundWallet(null, { faucetHost });
      
      const newAccountData = {
        name: accountType === 'standby' ? standbyAccount.name : operationalAccount.name,
        address: wallet.address,
        seed: wallet.seed
      };
      
      if (accountType === 'standby') {
        setStandbyAccount(newAccountData);
      } else {
        setOperationalAccount(newAccountData);
      }
      
      setResults(prev => prev + `\n\nNew ${accountType} account created!\nAddress: ${wallet.address}\nSeed: ${wallet.seed}`);
      
    } catch (error) {
      console.error('Error getting account:', error);
      setResults(prev => prev + `\n===Error: ${error.message}===\n`);
    } finally {
      await client.disconnect();
      setLoading(false);
    }
  };

  // Get account from seed
  const getAccountFromSeed = async (accountType) => {
    setLoading(true);
    const net = getNetworkUrl();
    const client = new xrpl.Client(net);
    
    try {
      await client.connect();
      setResults(`===Finding ${accountType} wallet.===\n\n`);
      
      const seed = accountType === 'standby' ? standbyAccount.seed : operationalAccount.seed;
      const wallet = xrpl.Wallet.fromSeed(seed);
      const address = wallet.address;
      
      const updatedAccount = {
        ...(accountType === 'standby' ? standbyAccount : operationalAccount),
        address: address
      };
      
      if (accountType === 'standby') {
        setStandbyAccount(updatedAccount);
      } else {
        setOperationalAccount(updatedAccount);
      }
      
      setResults(prev => prev + `===Wallet found.===\n\n${accountType} account address: ` + address + "\n\n");
      
    } catch (error) {
      console.error('Error getting account from seed:', error);
      setResults(prev => prev + `\nError: ${error.message}\n`);
    } finally {
      await client.disconnect();
      setLoading(false);
    }
  };

  // Create trust line
  const createTrustLine = async () => {
    if (!trustlineLimit || !destination || !currency) {
      alert('Please fill in all trust line fields');
      return;
    }
    
    setLoading(true);
    const net = getNetworkUrl();
    const client = new xrpl.Client(net);
    
    try {
      await client.connect();
      setResults(`===Creating Trust Line===\n\nConnected to ${net}.`);
      
      const standby_wallet = xrpl.Wallet.fromSeed(standbyAccount.seed);
      
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
      
      if (result.result.meta.TransactionResult == "tesSUCCESS") {
        setResults(prev => prev + `\n\nTrust line created successfully!`);
        setResults(prev => prev + `\nLimit: ${trustlineLimit}`);
        setResults(prev => prev + `\nCurrency: ${currency}`);
        setResults(prev => prev + `\nIssuer: ${destination}`);
      } else {
        setResults(prev => prev + `\n\nError creating trust line: ${result.result.meta.TransactionResult}`);
      }
      
    } catch (error) {
      console.error('Error creating trust line:', error);
      setResults(prev => prev + `\n\nError: ${error.message}`);
    } finally {
      await client.disconnect();
      setLoading(false);
    }
  };

  // Configure account (Allow Rippling)
  const configureAccount = async () => {
    setLoading(true);
    const net = getNetworkUrl();
    const client = new xrpl.Client(net);
    
    try {
      await client.connect();
      setResults(`===Configuring Operational Account===\n\nConnected to ${net}.`);
      
      const operational_wallet = xrpl.Wallet.fromSeed(operationalAccount.seed);
      
      const accountSet = {
        TransactionType: "AccountSet",
        Account: operational_wallet.address,
        SetFlag: 8 // asfDefaultRipple
      };
      
      const prepared = await client.autofill(accountSet);
      const signed = operational_wallet.sign(prepared);
      const result = await client.submitAndWait(signed.tx_blob);
      
      if (result.result.meta.TransactionResult == "tesSUCCESS") {
        setResults(prev => prev + `\n\nOperational account configured successfully!`);
        setResults(prev => prev + `\nAllow Rippling: Enabled`);
      } else {
        setResults(prev => prev + `\n\nError configuring account: ${result.result.meta.TransactionResult}`);
      }
      
    } catch (error) {
      console.error('Error configuring account:', error);
      setResults(prev => prev + `\n\nError: ${error.message}`);
    } finally {
      await client.disconnect();
      setLoading(false);
    }
  };

  // Issue tokens (Send Currency)
  const issueTokens = async () => {
    if (!amount || !destination || !currency) {
      alert('Please fill in all token issuing fields');
      return;
    }
    
    setLoading(true);
    const net = getNetworkUrl();
    const client = new xrpl.Client(net);
    
    try {
      await client.connect();
      setResults(`===Issuing Tokens===\n\nConnected to ${net}.`);
      
      const operational_wallet = xrpl.Wallet.fromSeed(operationalAccount.seed);
      
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
      
      if (result.result.meta.TransactionResult == "tesSUCCESS") {
        setResults(prev => prev + `\n\nTokens issued successfully!`);
        setResults(prev => prev + `\nAmount: ${amount}`);
        setResults(prev => prev + `\nCurrency: ${currency}`);
        setResults(prev => prev + `\nFrom: ${operational_wallet.address}`);
        setResults(prev => prev + `\nTo: ${destination}`);
      } else {
        setResults(prev => prev + `\n\nError issuing tokens: ${result.result.meta.TransactionResult}`);
      }
      
    } catch (error) {
      console.error('Error issuing tokens:', error);
      setResults(prev => prev + `\n\nError: ${error.message}`);
    } finally {
      await client.disconnect();
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Head>
        <title>AMM - XRPL</title>
        <meta name="description" content="Create and manage Automated Market Makers on XRPL" />
      </Head>

      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">AMM - Automated Market Maker</h1>
        
        {/* Network Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Choose your ledger instance:</h2>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="devnet"
                checked={selectedNetwork === 'devnet'}
                onChange={(e) => setSelectedNetwork(e.target.value)}
                className="w-4 h-4"
              />
              <span>Devnet</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="testnet"
                checked={selectedNetwork === 'testnet'}
                onChange={(e) => setSelectedNetwork(e.target.value)}
                className="w-4 h-4"
              />
              <span>Testnet</span>
            </label>
          </div>
        </div>

        {/* Account Management */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Standby Account */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Standby Account</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => getNewAccount('standby')}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Get New Standby Account
                </button>
                <button
                  onClick={() => getAccountFromSeed('standby')}
                  disabled={loading}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                  Get Account From Seed
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Standby Account Name</label>
                <input
                  type="text"
                  value={standbyAccount.name}
                  onChange={(e) => setStandbyAccount({...standbyAccount, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter a name for standby account"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Standby Account Address</label>
                <input
                  type="text"
                  value={standbyAccount.address}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Standby Account Seed</label>
                <input
                  type="text"
                  value={standbyAccount.seed}
                  onChange={(e) => setStandbyAccount({...standbyAccount, seed: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter or paste seed"
                />
              </div>
            </div>
          </div>

          {/* Operational Account */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Operational Account</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => getNewAccount('operational')}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Get New Operational Account
                </button>
                <button
                  onClick={() => getAccountFromSeed('operational')}
                  disabled={loading}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                  Get Account From Seed
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Operational Account Name</label>
                <input
                  type="text"
                  value={operationalAccount.name}
                  onChange={(e) => setOperationalAccount({...operationalAccount, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter a name for operational account"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Operational Account Address</label>
                <input
                  type="text"
                  value={operationalAccount.address}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Operational Account Seed</label>
                <input
                  type="text"
                  value={operationalAccount.seed}
                  onChange={(e) => setOperationalAccount({...operationalAccount, seed: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter or paste seed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Trust Line Creation */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Create Trust Line</h3>
          <p className="text-gray-600 mb-4">Create a trust line from the standby account to the operational account for issued tokens.</p>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Trust Line Limit</label>
              <input
                type="text"
                value={trustlineLimit}
                onChange={(e) => setTrustlineLimit(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="e.g., 10000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Issuer Address (Operational)</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Operational account address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Currency Code</label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="e.g., TST"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <button
              onClick={createTrustLine}
              disabled={loading}
              className="px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
            >
              Create Trust Line
            </button>
          </div>
        </div>

        {/* Token Issuing */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Issue Tokens</h3>
          <p className="text-gray-600 mb-4">Configure the operational account and issue tokens to the standby account.</p>
          
          <div className="mb-4">
            <button
              onClick={configureAccount}
              disabled={loading}
              className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 mr-4"
            >
              Configure Account (Allow Rippling)
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="e.g., 1000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Destination (Standby)</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Standby account address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Currency Code</label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="e.g., TST"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <button
              onClick={issueTokens}
              disabled={loading}
              className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            >
              Send Currency (Issue Tokens)
            </button>
          </div>
        </div>

        {/* Placeholder for next features */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-center">AMM creation and checking functionality coming next...</p>
        </div>
      </div>
    </div>
  );
}
