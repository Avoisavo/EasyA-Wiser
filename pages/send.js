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

  // Create Trust Line
  const createTrustLine = async () => {
    if (!currencyCode || !issuer || !amount) {
      alert('Please enter currency code, issuer, and amount');
      return;
    }
    
    setLoading(true);
    const net = getNetworkUrl();
    const client = new xrpl.Client(net);
    
    try {
      await client.connect();
      setResults('===Creating trust line===\n\n');
      
      const currentAccount = activeAccount === 'account1' ? account1 : account2;
      const wallet = xrpl.Wallet.fromSeed(currentAccount.seed);
      
      const trustSet_tx = {
        "TransactionType": "TrustSet",
        "Account": currentAccount.address,
        "LimitAmount": {
          "currency": currencyCode,
          "issuer": issuer,
          "value": amount
        }
      };
      
      setResults(prev => prev + `Creating trust line for ${currencyCode} with issuer ${issuer}...\n`);
      
      const ts_prepared = await client.autofill(trustSet_tx);
      const ts_signed = wallet.sign(ts_prepared);
      const ts_result = await client.submitAndWait(ts_signed.tx_blob);
      
      if (ts_result.result.meta.TransactionResult == "tesSUCCESS") {
        setResults(prev => prev + `\n===Trust line established between account\n${currentAccount.address}\nand account\n${issuer}===\n`);
        setResults(prev => prev + `Transaction hash: ${ts_result.result.hash}\n`);
      } else {
        setResults(prev => prev + `\n===Transaction failed: ${ts_result.result.meta.TransactionResult}===\n`);
      }
      
    } catch (error) {
      console.error('Error creating trust line:', error);
      setResults(prev => prev + `\n===Error: ${error.message}===\n`);
    } finally {
      await client.disconnect();
      setLoading(false);
    }
  };

  // Send Currency
  const sendCurrency = async () => {
    if (!currencyCode || !issuer || !amount || !destination) {
      alert('Please enter all required fields');
      return;
    }
    
    setLoading(true);
    const net = getNetworkUrl();
    const client = new xrpl.Client(net);
    
    try {
      await client.connect();
      setResults('===Sending Currency===\n\n');
      
      const currentAccount = activeAccount === 'account1' ? account1 : account2;
      const wallet = xrpl.Wallet.fromSeed(currentAccount.seed);
      
      const send_currency_tx = {
        "TransactionType": "Payment",
        "Account": wallet.address,
        "Amount": {
          "currency": currencyCode,
          "value": amount,
          "issuer": issuer
        },
        "Destination": destination
      };
      
      setResults(prev => prev + `Sending ${amount} ${currencyCode} to ${destination}...\n`);
      
      const pay_prepared = await client.autofill(send_currency_tx);
      const pay_signed = wallet.sign(pay_prepared);
      const pay_result = await client.submitAndWait(pay_signed.tx_blob);
      
      if (pay_result.result.meta.TransactionResult == "tesSUCCESS") {
        setResults(prev => prev + '\n===Transaction succeeded===\n');
        setResults(prev => prev + `Transaction hash: ${pay_result.result.hash}\n`);
      } else {
        setResults(prev => prev + `\n===Transaction failed: ${pay_result.result.meta.TransactionResult}===\n`);
      }
      
      // Update XRP balance
      const balance = await client.getXrpBalance(wallet.address);
      setXrpBalance(balance);
      
    } catch (error) {
      console.error('Error sending currency:', error);
      setResults(prev => prev + `\n===Error: ${error.message}===\n`);
    } finally {
      await client.disconnect();
      setLoading(false);
    }
  };

  // Get Token Balance
  const getTokenBalance = async () => {
    setLoading(true);
    const net = getNetworkUrl();
    const client = new xrpl.Client(net);
    
    try {
      await client.connect();
      setResults('===Getting Token Balance===\n\n');
      
      const currentAccount = activeAccount === 'account1' ? account1 : account2;
      const wallet = xrpl.Wallet.fromSeed(currentAccount.seed);
      
      // Get token balances
      const balance = await client.request({
        command: "account_lines",
        account: wallet.address,
        ledger_index: "validated",
      });
      
      setResults(prev => prev + `${currentAccount.name || 'Account'}'s token balances:\n`);
      
      if (balance.result.lines.length === 0) {
        setResults(prev => prev + 'No token balances found\n');
      } else {
        balance.result.lines.forEach(line => {
          setResults(prev => prev + `Currency: ${line.currency}\n`);
          setResults(prev => prev + `Balance: ${line.balance}\n`);
          setResults(prev => prev + `Issuer: ${line.account}\n`);
          setResults(prev => prev + '---\n');
        });
      }
      
      // Also get XRP balance
      const xrpBal = await client.getXrpBalance(wallet.address);
      setXrpBalance(xrpBal);
      setResults(prev => prev + `XRP Balance: ${xrpBal}\n`);
      
    } catch (error) {
      console.error('Error getting token balance:', error);
      setResults(prev => prev + `\n===Error: ${error.message}===\n`);
    } finally {
      await client.disconnect();
      setLoading(false);
    }
  };

  // Update active account display when selection changes
  useEffect(() => {
    if ((activeAccount === 'account1' && account1.seed) || (activeAccount === 'account2' && account2.seed)) {
      getTokenBalance();
    }
  }, [activeAccount]);

  const currentAccount = activeAccount === 'account1' ? account1 : account2;

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

        {/* Account Management */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Account 1 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Account 1</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => getNewAccount(1)}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Get New Account 1
                </button>
                <button
                  onClick={() => getAccountFromSeed(1)}
                  disabled={loading}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                  Get From Seed
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={account1.name}
                  onChange={(e) => setAccount1({...account1, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Account name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  value={account1.address}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Seed</label>
                <input
                  type="text"
                  value={account1.seed}
                  onChange={(e) => setAccount1({...account1, seed: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Seed"
                />
              </div>
            </div>
          </div>

          {/* Account 2 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Account 2</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => getNewAccount(2)}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Get New Account 2
                </button>
                <button
                  onClick={() => getAccountFromSeed(2)}
                  disabled={loading}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                  Get From Seed
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={account2.name}
                  onChange={(e) => setAccount2({...account2, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Account name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  value={account2.address}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Seed</label>
                <input
                  type="text"
                  value={account2.seed}
                  onChange={(e) => setAccount2({...account2, seed: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Seed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Currency Operations */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Currency Operations</h3>
          
          {/* Account Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Select Active Account:</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="account1"
                  checked={activeAccount === 'account1'}
                  onChange={(e) => setActiveAccount(e.target.value)}
                  className="w-4 h-4"
                />
                <span>Account 1</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="account2"
                  checked={activeAccount === 'account2'}
                  onChange={(e) => setActiveAccount(e.target.value)}
                  className="w-4 h-4"
                />
                <span>Account 2</span>
              </label>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Account Name</label>
                <input
                  type="text"
                  value={currentAccount.name}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Account Address</label>
                <input
                  type="text"
                  value={currentAccount.address}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">XRP Balance</label>
                <input
                  type="text"
                  value={xrpBalance}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Currency Code</label>
                <input
                  type="text"
                  value={currencyCode}
                  onChange={(e) => setCurrencyCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="e.g., USD, EUR, BTC"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Issuer</label>
                <input
                  type="text"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Issuer address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Amount"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Destination</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Destination address"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={createTrustLine}
              disabled={loading}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
            >
              Create Trust Line
            </button>
            <button
              onClick={sendCurrency}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            >
              Send Currency
            </button>
            <button
              onClick={getTokenBalance}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Get Token Balance
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Results</h3>
          <textarea
            value={results}
            onChange={(e) => setResults(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            rows={15}
            placeholder="Results will appear here..."
          />
        </div>

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
