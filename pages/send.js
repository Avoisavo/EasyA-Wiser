import { useState, useEffect } from 'react';
import Head from 'next/head';
import * as xrpl from 'xrpl';

export default function SendCurrency() {
  // Network selection
  const [selectedNetwork, setSelectedNetwork] = useState('testnet');
  
  // Account states
  const [account1, setAccount1] = useState({
    name: '',
    address: '',
    seed: ''
  });
  
  const [account2, setAccount2] = useState({
    name: '',
    address: '',
    seed: ''
  });
  
  // Active account selection
  const [activeAccount, setActiveAccount] = useState('account1');
  
  // Form states
  const [currencyCode, setCurrencyCode] = useState('');
  const [issuer, setIssuer] = useState('');
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('');
  const [results, setResults] = useState('');
  const [loading, setLoading] = useState(false);
  const [xrpBalance, setXrpBalance] = useState('');

  // Get network URL
  const getNetworkUrl = () => {
    return selectedNetwork === 'testnet' 
      ? 'wss://s.altnet.rippletest.net:51233/' 
      : 'wss://s.devnet.rippletest.net:51233/';
  };

  // Get new account from faucet
  const getNewAccount = async (accountNumber) => {
    setLoading(true);
    const net = getNetworkUrl();
    const client = new xrpl.Client(net);
    
    try {
      await client.connect();
      setResults(`===Getting Account===\n\nConnected to ${net}.`);
      
      const faucetHost = null;
      const { wallet } = await client.fundWallet(null, { faucetHost });
      
      const newAccountData = {
        name: accountNumber === 1 ? account1.name : account2.name,
        address: wallet.address,
        seed: wallet.seed
      };
      
      if (accountNumber === 1) {
        setAccount1(newAccountData);
      } else {
        setAccount2(newAccountData);
      }
      
      setResults(prev => prev + `\n\nNew account created!\nAddress: ${wallet.address}\nSeed: ${wallet.seed}`);
      
    } catch (error) {
      console.error('Error getting account:', error);
      setResults(prev => prev + `\n===Error: ${error.message}===\n`);
    } finally {
      await client.disconnect();
      setLoading(false);
    }
  };

  // Get account from seed
  const getAccountFromSeed = async (accountNumber) => {
    setLoading(true);
    const net = getNetworkUrl();
    const client = new xrpl.Client(net);
    
    try {
      await client.connect();
      setResults('===Finding wallet.===\n\n');
      
      const seed = accountNumber === 1 ? account1.seed : account2.seed;
      const wallet = xrpl.Wallet.fromSeed(seed);
      const address = wallet.address;
      
      const updatedAccount = {
        ...( accountNumber === 1 ? account1 : account2),
        address: address
      };
      
      if (accountNumber === 1) {
        setAccount1(updatedAccount);
      } else {
        setAccount2(updatedAccount);
      }
      
      setResults(prev => prev + "===Wallet found.===\n\n" + "Account address: " + address + "\n\n");
      
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
        <title>Send Currency - XRPL</title>
        <meta name="description" content="Create trust lines and send issued currencies on XRPL" />
      </Head>

      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Send Currency</h1>

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

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">Account management UI coming soon...</p>
          
          {/* Development testing buttons - will be replaced with proper UI */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => getNewAccount(1)}
              disabled={loading}
              className="px-3 py-1 bg-blue-500 text-white rounded text-xs disabled:opacity-50"
            >
              Test: Get Account 1
            </button>
            <button
              onClick={() => getAccountFromSeed(1)}
              disabled={loading}
              className="px-3 py-1 bg-green-500 text-white rounded text-xs disabled:opacity-50"
            >
              Test: Get From Seed
            </button>
          </div>
          
          {results && (
            <div className="mt-4">
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                {results}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
