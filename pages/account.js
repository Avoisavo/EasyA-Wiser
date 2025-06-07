import { useState, useEffect } from 'react';
import Head from 'next/head';
import * as xrpl from 'xrpl';

export default function Account() {
  // Network selection
  const [selectedNetwork, setSelectedNetwork] = useState('devnet');
  
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
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('');
  const [xrpBalance, setXrpBalance] = useState('');
  const [results, setResults] = useState('');
  const [loading, setLoading] = useState(false);

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

  // Get XRP balance
  const getXrpBalance = async () => {
    setLoading(true);
    const net = getNetworkUrl();
    const client = new xrpl.Client(net);
    
    try {
      await client.connect();
      setResults(`\n===Getting XRP balance...===\n\n`);
      
      const currentAccount = activeAccount === 'account1' ? account1 : account2;
      const wallet = xrpl.Wallet.fromSeed(currentAccount.seed);
      const balance = await client.getXrpBalance(wallet.address);
      
      setXrpBalance(balance);
      setResults(prev => prev + `${currentAccount.name || 'Account'} current XRP balance: ${balance}\n\n`);
      
    } catch (error) {
      console.error('Error getting XRP balance:', error);
      setResults(prev => prev + `\nError: ${error.message}\n`);
    } finally {
      await client.disconnect();
      setLoading(false);
    }
  };

  // Get token balance
  const getTokenBalance = async () => {
    setLoading(true);
    const net = getNetworkUrl();
    const client = new xrpl.Client(net);
    
    try {
      await client.connect();
      setResults(`===Connected to ${net}.===\n===Getting account token balance...===\n\n`);
      
      const currentAccount = activeAccount === 'account1' ? account1 : account2;
      const wallet = xrpl.Wallet.fromSeed(currentAccount.seed);
      
      const balance = await client.request({
        command: "gateway_balances",
        account: wallet.address,
        ledger_index: "validated",
      });
      
      setResults(prev => prev + `${currentAccount.name || 'Account'}'s token balance(s): ${JSON.stringify(balance.result, null, 2)}\n`);
      
      const xrpBal = await client.getXrpBalance(wallet.address);
      setXrpBalance(xrpBal);
      
    } catch (error) {
      console.error('Error getting token balance:', error);
      setResults(prev => prev + `\nError: ${error.message}\n`);
    } finally {
      await client.disconnect();
      setLoading(false);
    }
  };

  // Send XRP
  const sendXrp = async () => {
    if (!amount || !destination) {
      alert('Please enter amount and destination');
      return;
    }
    
    setLoading(true);
    const net = getNetworkUrl();
    const client = new xrpl.Client(net);
    
    try {
      await client.connect();
      setResults(`===Sending XRP...===\n\n`);
      
      const currentAccount = activeAccount === 'account1' ? account1 : account2;
      const wallet = xrpl.Wallet.fromSeed(currentAccount.seed);
      
      const prepared = await client.autofill({
        TransactionType: "Payment",
        Account: wallet.address,
        Amount: xrpl.xrpToDrops(amount),
        Destination: destination,
      });
      
      const signed = wallet.sign(prepared);
      const result = await client.submitAndWait(signed.tx_blob);
      
      setResults(prev => prev + `Transaction result: ${result.result.meta.TransactionResult}\n`);
      setResults(prev => prev + `Balance changes: ${JSON.stringify(result.result.meta.AffectedNodes, null, 2)}\n`);
      
      // Update balance after sending
      await getXrpBalance();
      
    } catch (error) {
      console.error('Error sending XRP:', error);
      setResults(prev => prev + `\nError: ${error.message}\n`);
    } finally {
      await client.disconnect();
      setLoading(false);
    }
  };

  // Update active account display when selection changes
  useEffect(() => {
    if ((activeAccount === 'account1' && account1.seed) || (activeAccount === 'account2' && account2.seed)) {
      getXrpBalance();
    }
  }, [activeAccount]);

  const currentAccount = activeAccount === 'account1' ? account1 : account2;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Head>
        <title>XRPL Account Manager</title>
        <meta name="description" content="Manage XRPL accounts and send XRP" />
      </Head>

      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">XRPL Account Manager</h1>

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
                  Get Account From Seed
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Account 1 Name</label>
                <input
                  type="text"
                  value={account1.name}
                  onChange={(e) => setAccount1({...account1, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter a name for this account"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Account 1 Address</label>
                <input
                  type="text"
                  value={account1.address}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Account 1 Seed</label>
                <input
                  type="text"
                  value={account1.seed}
                  onChange={(e) => setAccount1({...account1, seed: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter or paste seed"
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
                  Get Account From Seed
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Account 2 Name</label>
                <input
                  type="text"
                  value={account2.name}
                  onChange={(e) => setAccount2({...account2, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter a name for this account"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Account 2 Address</label>
                <input
                  type="text"
                  value={account2.address}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Account 2 Seed</label>
                <input
                  type="text"
                  value={account2.seed}
                  onChange={(e) => setAccount2({...account2, seed: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter or paste seed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Panel */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Send XRP Transaction</h3>
          
          {/* Account Selection */}
          <div className="mb-4">
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
                <label className="block text-sm font-medium mb-1">Account Seed</label>
                <input
                  type="text"
                  value={currentAccount.seed}
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
                <label className="block text-sm font-medium mb-1">Amount (XRP)</label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter amount to send"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Destination Address</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter destination address"
                />
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={sendXrp}
                  disabled={loading}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                >
                  Send XRP
                </button>
                <button
                  onClick={getXrpBalance}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Get XRP Balance
                </button>
                <button
                  onClick={getTokenBalance}
                  disabled={loading}
                  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
                >
                  Get Token Balance
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">Account info management coming soon...</p>
          
          {results && (
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Results</label>
              <textarea
                value={results}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                rows={6}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
