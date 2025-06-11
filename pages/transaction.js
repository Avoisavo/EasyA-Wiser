"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Check, RefreshCw, DollarSign, CreditCard as CardIcon, Send } from "lucide-react"
import Header from "../components/header";
import { useWallet } from "../contexts/WalletContext";
import { transferUtils } from "../utils/transferUtils";

export default function SimulateTransactionPage() {
  const { isConnected, walletAddress, walletType } = useWallet();
  
  const [cardData, setCardData] = useState(null);
  const [transactionAmount, setTransactionAmount] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [transactionResult, setTransactionResult] = useState(null);
  const [ethTransferResult, setEthTransferResult] = useState(null);
  const [step, setStep] = useState(0);
  
  // New states for tracking progress
  const [cardTransactionComplete, setCardTransactionComplete] = useState(false);
  const [ethTransferComplete, setEthTransferComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState('');

  // Load card details from local storage on component mount
  useEffect(() => {
    const storedData = localStorage.getItem('newCardDetails');
    if (storedData) {
      setCardData(JSON.parse(storedData));
    }
  }, []);

  const isFormValid = () => {
    return (
      isConnected &&
      cardData &&
      transactionAmount.trim() !== "" &&
      !isNaN(parseFloat(transactionAmount)) &&
      parseFloat(transactionAmount) > 0
    );
  };
  
  const handleProceedToConfirm = () => {
    if (!isFormValid()) return;
    setError(null);
    setStep(1); // Move to confirmation step
  };

  const processTransaction = async () => {
    if (!isFormValid()) return;
    
    setIsProcessing(true);
    setError(null);
    setCardTransactionComplete(false);
    setEthTransferComplete(false);

    try {
      // Step 1: Process Card Transaction
      setCurrentStep('Processing card transaction...');
      console.log('🏦 Starting card transaction...');
      
      const response = await fetch('/api/transact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(transactionAmount),
          card_token: cardData.card.token
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to simulate transaction');
      }

      const cardResult = {
        success: data.success,
        id: data.transaction.token,
        timestamp: new Date().toISOString(),
        amount: data.transaction.amount,
        merchant: data.transaction.merchant,
        xrpl: data.xrpl || null
      };

      setTransactionResult(cardResult);
      setCardTransactionComplete(true);
      console.log('✅ Card transaction successful');

      // Step 2: Process ETH Transfer (only if user has MetaMask/compatible wallet)
      if (walletType === 'metamask' || walletAddress.startsWith('0x')) {
        setCurrentStep('Please sign the transaction in MetaMask...');
        console.log('💰 Waiting for user to sign ETH transfer...');
        
        try {
          // This will wait for user to sign AND for transaction to be confirmed
          const ethResult = await transferUtils.sendToTargetAddress(walletAddress);
          
          setCurrentStep('Transaction signed! Waiting for blockchain confirmation...');
          console.log('📝 Transaction signed, waiting for confirmation...');
          
          // Additional wait for confirmation if needed
          if (ethResult.transactionHash) {
            setCurrentStep('Confirming transaction on blockchain...');
            // The transferUtils should handle waiting for confirmation
          }
          
          setEthTransferResult(ethResult);
          setEthTransferComplete(true);
          console.log('✅ ETH transfer confirmed on blockchain:', ethResult);
          
          // Wait 7 seconds before showing results
          setCurrentStep('Transaction completed! Preparing results...');
          setTimeout(() => {
            setStep(2);
          }, 7000);
          
        } catch (ethError) {
          console.error('❌ ETH transfer failed:', ethError);
          setEthTransferResult({
            success: false,
            error: ethError.message
          });
          setEthTransferComplete(true);
          
          // Wait 7 seconds even for failed transactions
          setTimeout(() => {
            setStep(2);
          }, 7000);
        }
      } else {
        console.log('ℹ️ Skipping ETH transfer - not a MetaMask wallet');
        setEthTransferComplete(true);
        setStep(2);
      }

    } catch (err) {
      console.error('❌ Transaction process failed:', err);
      setError(err.message);
    } finally {
      setIsProcessing(false);
      setCurrentStep('');
    }
  };

  const resetTransaction = () => {
    setTransactionResult(null);
    setEthTransferResult(null);
    setTransactionAmount("");
    setStep(0);
    setError(null);
    setCardTransactionComplete(false);
    setEthTransferComplete(false);
    setCurrentStep('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <header className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">Simulate a Card Transaction</h1>
        <p className="text-gray-600 text-center mt-2 max-w-2xl mx-auto">
          Use your newly created virtual card to make a test payment and send ETH.
        </p>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-lg">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!isConnected ? (
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Connect Your Wallet</h2>
              <p className="text-gray-600">You need to connect your wallet first to be able to use a card.</p>
            </div>
          ) : !cardData ? (
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No Card Found</h2>
              <p className="text-gray-600">Please generate a card first before making a transaction.</p>
            </div>
          ) : !transactionResult ? (
            <div className="space-y-8">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg">
                  <p>{error}</p>
                </div>
              )}

              {step === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <CardIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Selected Card
                  </h2>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="font-mono text-gray-700">**** **** **** {cardData.card.lastFour}</p>
                    <p className="text-sm text-gray-600">
                      {cardData.cardholder.firstName} {cardData.cardholder.lastName}
                    </p>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-800 flex items-center pt-4">
                    <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                    Transaction Details
                  </h2>
                  <div>
                    <label htmlFor="amount" className="block text-gray-700 mb-1">
                      Amount (USD)
                    </label>
                    <input
                      id="amount"
                      name="amount"
                      placeholder="e.g., 25.00"
                      value={transactionAmount}
                      onChange={(e) => setTransactionAmount(e.target.value)}
                      className="w-full mt-1 bg-white text-gray-800 border border-gray-300 p-2 rounded-md"
                    />
                  </div>
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={handleProceedToConfirm}
                      disabled={!isFormValid() || isProcessing}
                      className={`bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl text-lg flex items-center ${
                        !isFormValid() || isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isProcessing ? "Processing..." : "Proceed"}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}
              
              {step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 text-center">Confirm Transaction</h3>
                  <div className="bg-gray-100 p-6 rounded-xl space-y-4">
                    <div>
                      <p className="text-gray-600 text-sm">Amount</p>
                      <p className="text-gray-800 font-bold text-2xl">
                        ${parseFloat(transactionAmount).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">To Merchant</p>
                      <p className="text-gray-800 font-medium">Test Merchant</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Using Card</p>
                      <p className="text-gray-800 font-medium">
                        **** **** **** {cardData.card.lastFour}
                      </p>
                    </div>
                  </div>

                  {/* Processing Status */}
                  {isProcessing && (
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                      <div className="flex items-center">
                        <RefreshCw className="w-5 h-5 mr-3 animate-spin text-yellow-600" />
                        <div>
                          <p className="font-medium text-yellow-800">Processing...</p>
                          <p className="text-sm text-yellow-700">{currentStep}</p>
                        </div>
                      </div>
                      
                      {/* Progress indicators */}
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full mr-3 ${cardTransactionComplete ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span className={`text-sm ${cardTransactionComplete ? 'text-green-700' : 'text-gray-600'}`}>
                            Card Transaction {cardTransactionComplete ? '✓' : '...'}
                          </span>
                        </div>
                        {(walletType === 'metamask' || walletAddress.startsWith('0x')) && (
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full mr-3 ${ethTransferComplete ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <span className={`text-sm ${ethTransferComplete ? 'text-green-700' : 'text-gray-600'}`}>
                              ETH Transfer {ethTransferComplete ? '✓' : '...'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <button 
                      onClick={() => setStep(0)} 
                      disabled={isProcessing}
                      className={`flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-xl ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      Back
                    </button>
                    <button
                      onClick={processTransaction}
                      disabled={isProcessing}
                      className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center ${
                        isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : "Confirm Payment"}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`w-20 h-20 ${transactionResult.success ? "bg-green-100" : "bg-red-100"} rounded-full flex items-center justify-center mx-auto`}
              >
                {transactionResult.success ? (
                  <Check className="w-10 h-10 text-green-600" />
                ) : (
                  <span className="text-4xl">!</span>
                )}
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {transactionResult.success ? "Transaction Processed!" : "Transaction Failed"}
                </h2>
                <p className="text-gray-600 mt-2">
                  {transactionResult.success ? "Your test payment has been processed." : (error || "An unknown error occurred.")}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl text-left space-y-2">
                <h4 className="font-semibold text-gray-700 mb-3">Card Transaction</h4>
                <div className="flex justify-between">
                  <p className="text-gray-600">Transaction ID:</p>
                  <p className="font-mono text-gray-800 text-xs">{transactionResult.id}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Amount:</p>
                  <p className="font-bold text-gray-800">${parseFloat(transactionResult.amount).toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Date:</p>
                  <p className="text-gray-800">{new Date(transactionResult.timestamp).toLocaleString()}</p>
                </div>
                
                {transactionResult.xrpl && transactionResult.xrpl.hash && (
                  <>
                    <hr className="my-3 border-gray-300" />
                    <div className="flex justify-between">
                      <p className="text-gray-600">XRPL Explorer:</p>
                      <a 
                        href={`https://test.xrplexplorer.com/en/tx/${transactionResult.xrpl.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
                      >
                        View in Explorer
                      </a>
                    </div>
                  </>
                )}
                
                {ethTransferResult && (
                  <>
                    <hr className="my-3 border-gray-300" />
                    <h4 className="font-semibold text-gray-700">ETH Transfer</h4>
                    {ethTransferResult.success ? (
                      <>
                        <div className="flex justify-between">
                          <p className="text-gray-600">Status:</p>
                          <p className="text-green-600 font-medium">✅ Successful</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-gray-600">Amount:</p>
                          <p className="text-gray-800">{ethTransferResult.amount} ETH</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-gray-600">To:</p>
                          <p className="font-mono text-gray-800 text-xs">{ethTransferResult.recipient.slice(0, 10)}...</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-gray-600">Arbitrum Explorer:</p>
                          <a 
                            href={ethTransferResult.explorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
                          >
                            View Transaction
                          </a>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <p className="text-gray-600">Status:</p>
                          <p className="text-red-600 font-medium">❌ Failed</p>
                        </div>
                        <div className="bg-red-50 border border-red-200 p-3 rounded mt-2">
                          <p className="text-red-700 text-sm">{ethTransferResult.error}</p>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
              
              <button
                onClick={resetTransaction}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl"
              >
                Make Another Transaction
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
} 