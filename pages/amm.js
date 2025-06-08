import { useState, useEffect } from 'react';
import Head from 'next/head';
import * as xrpl from 'xrpl';
import {
  getNetworkUrl,
  getNewAccountFromFaucet,
  getAccountFromSeed,
  createTrustLine as createTrustLineUtil,
  configureAccount as configureAccountUtil,
  issueTokens as issueTokensUtil,
  checkAMM as checkAMMUtil,
  createAMM as createAMMUtil
} from '../utils/xrpl';

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

  // Get new account from faucet
  const getNewAccount = async (accountType) => {
    setLoading(true);
    const networkUrl = getNetworkUrl(selectedNetwork);
    
    try {
      setResults(`===Getting ${accountType} Account===\n\nConnected to ${networkUrl}.`);
      
      const result = await getNewAccountFromFaucet(networkUrl);
      
      if (result.success) {
        const newAccountData = {
          name: accountType === 'standby' ? standbyAccount.name : operationalAccount.name,
          address: result.data.address,
          seed: result.data.seed
        };
        
        if (accountType === 'standby') {
          setStandbyAccount(newAccountData);
        } else {
          setOperationalAccount(newAccountData);
        }
        
        setResults(prev => prev + `\n\n${result.message}`);
      } else {
        setResults(prev => prev + `\n===Error: ${result.message}===\n`);
      }
      
    } catch (error) {
      console.error('Error getting account:', error);
      setResults(prev => prev + `\n===Error: ${error.message}===\n`);
    } finally {
      setLoading(false);
    }
  };

  // Get account from seed
  const getAccountFromSeedHandler = async (accountType) => {
    setLoading(true);
    const networkUrl = getNetworkUrl(selectedNetwork);
    
    try {
      setResults(`===Finding ${accountType} wallet.===\n\n`);
      
      const seed = accountType === 'standby' ? standbyAccount.seed : operationalAccount.seed;
      const result = await getAccountFromSeed(seed, networkUrl);
      
      if (result.success) {
        const updatedAccount = {
          ...(accountType === 'standby' ? standbyAccount : operationalAccount),
          address: result.data.address
        };
        
        if (accountType === 'standby') {
          setStandbyAccount(updatedAccount);
        } else {
          setOperationalAccount(updatedAccount);
        }
        
        setResults(prev => prev + `===Wallet found.===\n\n${accountType} account address: ${result.data.address}\n\n`);
      } else {
        setResults(prev => prev + `\nError: ${result.message}\n`);
      }
      
    } catch (error) {
      console.error('Error getting account from seed:', error);
      setResults(prev => prev + `\nError: ${error.message}\n`);
    } finally {
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
    const networkUrl = getNetworkUrl(selectedNetwork);
    
    try {
      setResults(`===Creating Trust Line===\n\nConnected to ${networkUrl}.`);
      
      const config = {
        trustlineLimit,
        destination,
        currency,
        standbyAccountSeed: standbyAccount.seed
      };
      
      const result = await createTrustLineUtil(config, networkUrl);
      
      if (result.success) {
        setResults(prev => prev + `\n\n${result.message}`);
      } else {
        setResults(prev => prev + `\n\n${result.message}`);
      }
      
    } catch (error) {
      console.error('Error creating trust line:', error);
      setResults(prev => prev + `\n\nError: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Configure account (Allow Rippling)
  const configureAccount = async () => {
    setLoading(true);
    const networkUrl = getNetworkUrl(selectedNetwork);
    
    try {
      setResults(`===Configuring Operational Account===\n\nConnected to ${networkUrl}.`);
      
      const result = await configureAccountUtil(operationalAccount.seed, networkUrl);
      
      if (result.success) {
        setResults(prev => prev + `\n\n${result.message}`);
      } else {
        setResults(prev => prev + `\n\n${result.message}`);
      }
      
    } catch (error) {
      console.error('Error configuring account:', error);
      setResults(prev => prev + `\n\nError: ${error.message}`);
    } finally {
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
    const networkUrl = getNetworkUrl(selectedNetwork);
    
    try {
      setResults(`===Issuing Tokens===\n\nConnected to ${networkUrl}.`);
      
      const config = {
        amount,
        destination,
        currency,
        operationalAccountSeed: operationalAccount.seed
      };
      
      const result = await issueTokensUtil(config, networkUrl);
      
      if (result.success) {
        setResults(prev => prev + `\n\n${result.message}`);
      } else {
        setResults(prev => prev + `\n\n${result.message}`);
      }
      
    } catch (error) {
      console.error('Error issuing tokens:', error);
      setResults(prev => prev + `\n\nError: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Check AMM
  const checkAMM = async () => {
    if (!asset1Currency || !asset2Currency) {
      alert('Please fill in both asset currencies');
      return;
    }
    
    setLoading(true);
    const networkUrl = getNetworkUrl(selectedNetwork);
    
    try {
      setAmmInfo(`===Checking AMM===\n\nConnected to ${networkUrl}.`);
      
      const config = {
        asset1Currency,
        asset1Issuer,
        asset2Currency,
        asset2Issuer
      };
      
      const result = await checkAMMUtil(config, networkUrl);
      
      if (result.success) {
        setAmmInfo(prev => prev + `\n\n${result.message}`);
      } else {
        setAmmInfo(prev => prev + `\n\n${result.message}`);
      }
      
    } catch (error) {
      console.error('Error checking AMM:', error);
      setAmmInfo(prev => prev + `\n\nAMM not found or error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Create AMM
  const createAMM = async () => {
    if (!asset1Currency || !asset1Amount || !asset2Currency || !asset2Amount) {
      alert('Please fill in all AMM asset fields');
      return;
    }
    
    setLoading(true);
    const networkUrl = getNetworkUrl(selectedNetwork);
    
    try {
      setResults(`===Creating AMM===\n\nConnected to ${networkUrl}.`);
      
      const config = {
        asset1Currency,
        asset1Issuer,
        asset1Amount,
        asset2Currency,
        asset2Issuer,
        asset2Amount,
        standbyAccountSeed: standbyAccount.seed
      };
      
      const result = await createAMMUtil(config, networkUrl);
      
      if (result.success) {
        setResults(prev => prev + `\n\n${result.preparedTransactionMessage}`);
        setResults(prev => prev + `\n\nSending AMMCreate transaction...`);
        setResults(prev => prev + `\n\n${result.message}`);
        // Update AMM info after creation
        setTimeout(() => checkAMM(), 2000);
      } else {
        setResults(prev => prev + `\n\n${result.message}`);
      }
      
    } catch (error) {
      console.error('Error creating AMM:', error);
      setResults(prev => prev + `\n\nError: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Convenience functions for better UX
  const autofillOperationalAddress = () => {
    if (operationalAccount.address) {
      setDestination(operationalAccount.address);
    }
  };

  const autofillStandbyAddress = () => {
    if (standbyAccount.address) {
      setDestination(standbyAccount.address);
    }
  };

  const autofillAssetIssuer = (assetNumber) => {
    if (operationalAccount.address) {
      if (assetNumber === 1) {
        setAsset1Issuer(operationalAccount.address);
      } else {
        setAsset2Issuer(operationalAccount.address);
      }
    }
  };

  const clearTrustLineForm = () => {
    setTrustlineLimit('');
    setDestination('');
    setCurrency('');
  };

  const clearTokenForm = () => {
    setAmount('');
    setDestination('');
    setCurrency('');
  };

  const clearAMMForm = () => {
    setAsset1Currency('');
    setAsset1Issuer('');
    setAsset1Amount('');
    setAsset2Currency('');
    setAsset2Issuer('');
    setAsset2Amount('');
  };

  const setupXRPTokenPair = () => {
    setAsset1Currency('XRP');
    setAsset1Issuer('');
    setAsset2Currency('TST');
    setAsset2Issuer(operationalAccount.address);
  };

  const gatherAccountInfo = () => {
    const accountData = `Standby Account:\n${standbyAccount.name}\n${standbyAccount.address}\n${standbyAccount.seed}\n\nOperational Account:\n${operationalAccount.name}\n${operationalAccount.address}\n${operationalAccount.seed}`;
    setResults(accountData);
  };

  const distributeAccountInfo = () => {
    const lines = results.split('\n').filter(line => line.trim() !== '');
    const standbyIndex = lines.findIndex(line => line.includes('Standby Account:'));
    const operationalIndex = lines.findIndex(line => line.includes('Operational Account:'));
    
    if (standbyIndex !== -1 && standbyIndex + 3 < lines.length) {
      setStandbyAccount({
        name: lines[standbyIndex + 1] || '',
        address: lines[standbyIndex + 2] || '',
        seed: lines[standbyIndex + 3] || ''
      });
    }
    
    if (operationalIndex !== -1 && operationalIndex + 3 < lines.length) {
      setOperationalAccount({
        name: lines[operationalIndex + 1] || '',
        address: lines[operationalIndex + 2] || '',
        seed: lines[operationalIndex + 3] || ''
      });
    }
  };

  // Auto-populate fields when accounts change
  useEffect(() => {
    // Auto-populate asset issuers when operational account is available
    if (operationalAccount.address) {
      if (asset1Currency && asset1Currency !== 'XRP' && !asset1Issuer) {
        setAsset1Issuer(operationalAccount.address);
      }
      if (asset2Currency && asset2Currency !== 'XRP' && !asset2Issuer) {
        setAsset2Issuer(operationalAccount.address);
      }
    }
  }, [operationalAccount.address, asset1Currency, asset2Currency]);

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
                  onClick={() => getAccountFromSeedHandler('standby')}
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
                  onClick={() => getAccountFromSeedHandler('operational')}
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
              <div className="flex gap-2">
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Operational account address"
                />
                <button
                  onClick={autofillOperationalAddress}
                  disabled={!operationalAccount.address}
                  className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 text-sm"
                  title="Auto-fill operational address"
                >
                  Auto
                </button>
              </div>
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
          
          <div className="flex gap-2 mt-4">
            <button
              onClick={createTrustLine}
              disabled={loading}
              className="px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
            >
              Create Trust Line
            </button>
            <button
              onClick={clearTrustLineForm}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Clear
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
              <div className="flex gap-2">
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Standby account address"
                />
                <button
                  onClick={autofillStandbyAddress}
                  disabled={!standbyAccount.address}
                  className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 text-sm"
                  title="Auto-fill standby address"
                >
                  Auto
                </button>
              </div>
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
          
          <div className="flex gap-2 mt-4">
            <button
              onClick={issueTokens}
              disabled={loading}
              className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            >
              Send Currency (Issue Tokens)
            </button>
            <button
              onClick={clearTokenForm}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Clear
            </button>
          </div>
        </div>

        {/* AMM Management */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">AMM Management</h3>
          <p className="text-gray-600 mb-4">Check for existing AMM pairs and create new AMM pools.</p>
          
          <div className="mb-4">
            <button
              onClick={setupXRPTokenPair}
              disabled={!operationalAccount.address}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50 mr-2"
            >
              Setup XRP/TST Pair
            </button>
            <button
              onClick={clearAMMForm}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Clear AMM Form
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Asset 1 */}
            <div className="space-y-4">
              <h4 className="text-md font-semibold">Asset 1</h4>
              
              <div>
                <label className="block text-sm font-medium mb-1">Currency</label>
                <input
                  type="text"
                  value={asset1Currency}
                  onChange={(e) => setAsset1Currency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="e.g., XRP or TST"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Issuer (if not XRP)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={asset1Issuer}
                    onChange={(e) => setAsset1Issuer(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Issuer address"
                    disabled={asset1Currency === 'XRP'}
                  />
                  <button
                    onClick={() => autofillAssetIssuer(1)}
                    disabled={!operationalAccount.address || asset1Currency === 'XRP'}
                    className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 text-sm"
                    title="Auto-fill operational address"
                  >
                    Auto
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="text"
                  value={asset1Amount}
                  onChange={(e) => setAsset1Amount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="e.g., 1000"
                />
              </div>
            </div>
            
            {/* Asset 2 */}
            <div className="space-y-4">
              <h4 className="text-md font-semibold">Asset 2</h4>
              
              <div>
                <label className="block text-sm font-medium mb-1">Currency</label>
                <input
                  type="text"
                  value={asset2Currency}
                  onChange={(e) => setAsset2Currency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="e.g., XRP or FOO"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Issuer (if not XRP)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={asset2Issuer}
                    onChange={(e) => setAsset2Issuer(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Issuer address"
                    disabled={asset2Currency === 'XRP'}
                  />
                  <button
                    onClick={() => autofillAssetIssuer(2)}
                    disabled={!operationalAccount.address || asset2Currency === 'XRP'}
                    className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 text-sm"
                    title="Auto-fill operational address"
                  >
                    Auto
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="text"
                  value={asset2Amount}
                  onChange={(e) => setAsset2Amount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="e.g., 500"
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 mt-6">
            <button
              onClick={checkAMM}
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Check AMM
            </button>
            <button
              onClick={createAMM}
              disabled={loading}
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              Create AMM
            </button>
          </div>
        </div>

        {/* Account Info Management */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Account Information Management</h3>
          <p className="text-gray-600 mb-4">Save and restore account information for future sessions.</p>
          <div className="flex gap-4 mb-4">
            <button
              onClick={gatherAccountInfo}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Gather Account Info
            </button>
            <button
              onClick={distributeAccountInfo}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Distribute Account Info
            </button>
          </div>
        </div>

        {/* Results and AMM Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Results */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Results</h3>
            <textarea
              value={results}
              onChange={(e) => setResults(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 font-mono text-sm"
              rows={15}
              placeholder="Transaction results will appear here..."
            />
            <button
              onClick={() => setResults('')}
              className="mt-2 px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm"
            >
              Clear Results
            </button>
          </div>
          
          {/* AMM Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">AMM Information</h3>
            <textarea
              value={ammInfo}
              onChange={(e) => setAmmInfo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 font-mono text-sm"
              rows={15}
              placeholder="AMM information will appear here..."
            />
            <button
              onClick={() => setAmmInfo('')}
              className="mt-2 px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm"
            >
              Clear AMM Info
            </button>
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span>Processing...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
