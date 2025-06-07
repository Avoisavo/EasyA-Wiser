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

        {/* Testing Buttons - Basic account creation testing */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Test Account Functions</h3>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => getNewAccount('standby')}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Get New Standby Account
            </button>
            <button
              onClick={() => getNewAccount('operational')}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Get New Operational Account
            </button>
            <button
              onClick={() => getAccountFromSeed('standby')}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              Get Standby From Seed
            </button>
            <button
              onClick={() => getAccountFromSeed('operational')}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              Get Operational From Seed
            </button>
          </div>
        </div>

        {/* Content will be added in subsequent commits */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-center">Account management UI coming next...</p>
        </div>
      </div>
    </div>
  );
}
