"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from 'next/link'
import { useWallet } from '../contexts/WalletContext'
import ConnectWallet from "../components/connectwallet"
import { useRouter } from 'next/router'

export default function CreatePage() {
  const { isConnected, walletAddress, walletType, disconnect } = useWallet()
  const router = useRouter()
  
  // Header state
  const [walletModalOpen, setWalletModalOpen] = useState(false)
  
  // Form and card state
  const [error, setError] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [cardDetails, setCardDetails] = useState(null)
  const [copied, setCopied] = useState(false)

  // Function to truncate wallet address for display
  const truncateAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const generateCardDetails = async () => {
    // Validate form fields
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields")
      return
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      setError("Please enter a valid email address")
      return
    }

    if (password.length !== 6 || !/^\d{6}$/.test(password)) {
      setError("PIN must be exactly 6 digits")
      return
    }
    
    setError("")
    setIsCreating(true)

    try {
      const response = await fetch('/api/createCard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          firstName, 
          lastName, 
          email,
          password,
          walletAddress
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create card.")
      }

      // Format card number with spaces for display
      let formattedCardNumber = "•••• •••• •••• ••••"
      if (data.card && data.card.pan) {
        formattedCardNumber = data.card.pan.match(/.{1,4}/g)?.join(" ") || data.card.pan
      }

      // Get expiry date from the response
      let expiry = "MM/YY"
      if (data.card && data.card.expiration) {
        expiry = `${data.card.expiration.substring(0, 2)}/${data.card.expiration.substring(2)}`
      }

      // Set CVV (you can modify this logic as needed)
      const cvv = "999"

      setCardDetails({
        number: formattedCardNumber,
        expiry,
        cvv,
        name: `${firstName.toUpperCase()} ${lastName.toUpperCase()}`,
        rawNumber: data.card?.pan || formattedCardNumber.replace(/\s/g, "")
      })

      // Save to localStorage for navigation to card page
      localStorage.setItem('newCardDetails', JSON.stringify(data))
      
    } catch (err) {
      console.error("Card creation error:", err)
      setError(err.message)
    } finally {
      setIsCreating(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    generateCardDetails()
  }

  return (
    <>
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-in {
          from { opacity: 0; transform: scale(0.3); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-bounce-in {
          animation: bounce-in 0.8s ease-out;
        }
      `}</style>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 border-b border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Logo and Title */}
            <Link href="/card" className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity duration-200">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
                Trade Me Baby
              </span>
            </Link>

            {/* Right side - Connect Wallet Button or Connected Address */}
            {!isConnected ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-full border border-blue-200 bg-white/80 text-blue-700 font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center space-x-2"
                onClick={() => setWalletModalOpen(true)}
              >
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>Connect Wallet</span>
              </motion.button>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-medium flex items-center space-x-2">
                  <img 
                    src={walletType === 'crossmark' ? "/crossmart.png" : "/fox.png"} 
                    alt={walletType} 
                    className="w-5 h-5"
                  />
                  <span>{truncateAddress(walletAddress)}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={disconnect}
                  className="p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors"
                  title="Disconnect Wallet"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </header>
      <ConnectWallet
        open={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8 px-4 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 p-8 bg-blue-600 text-white rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border border-blue-200">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              💳 Create Your Virtual Debit Card
            </h1>
            <p className="text-lg opacity-90 animate-fade-in">
              Connect your wallet and generate a virtual debit card linked to your account
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-blue-200">
            {!isConnected ? (
              <div className="flex flex-col items-center justify-center py-16 px-8">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-12 h-12 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-blue-600 mb-4">Connect Your Wallet</h2>
                <p className="text-gray-600 text-center mb-8 max-w-md">
                  Connect your XRPL wallet to generate a virtual debit card linked to your wallet address.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2"
                  onClick={() => setWalletModalOpen(true)}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span>Connect Wallet</span>
                </motion.button>
              </div>
            ) : (
              <div className="p-8">
                <div className="space-y-8">
                  {/* Wallet Connected Section */}
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-blue-600">Wallet Connected</h3>
                      <div className="bg-green-500/20 text-green-600 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Connected</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-gray-700 font-mono truncate flex-1 bg-white px-3 py-2 rounded-lg border">
                        {walletAddress}
                      </div>
                      <button
                        onClick={() => copyToClipboard(walletAddress)}
                        className="text-blue-600 hover:text-blue-700 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                      >
                        {copied ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {!cardDetails ? (
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Enter Your Details</h3>
                        
                        {error && (
                          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 border border-red-200">
                            {error}
                          </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">
                                First Name *
                              </label>
                              <input
                                id="firstName"
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                placeholder="John"
                                required
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">
                                Last Name *
                              </label>
                              <input
                                id="lastName"
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                placeholder="Doe"
                                required
                              />
                            </div>
                            
                            <div className="md:col-span-2">
                              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                                Email Address *
                              </label>
                              <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                placeholder="example@email.com"
                                required
                              />
                            </div>

                            <div className="md:col-span-2">
                              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                                6-Digit Card PIN *
                              </label>
                              <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                placeholder="••••••"
                                maxLength={6}
                                pattern="\d{6}"
                                title="PIN must be 6 digits"
                                required
                              />
                            </div>
                          </div>

                          <div className="flex justify-center pt-6">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="submit"
                              disabled={isCreating}
                              className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl text-lg hover:bg-blue-700 transition-all duration-300 flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isCreating ? (
                                <>
                                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                  </svg>
                                  <span>Generating Card...</span>
                                </>
                              ) : (
                                <>
                                  <span>💳</span>
                                  <span>Generate Debit Card</span>
                                </>
                              )}
                            </motion.button>
                          </div>
                        </form>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8 animate-bounce-in">
                      {/* Virtual Card Display */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative w-full max-w-md mx-auto h-[220px]"
                        style={{ perspective: "1000px" }}
                      >
                        <div
                          className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-xl p-6 flex flex-col justify-between"
                          style={{
                            transformStyle: "preserve-3d",
                            transform: "rotateY(-5deg) rotateX(5deg)",
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-1">
                              <div className="text-white font-bold text-lg">TRADE ME BABY</div>
                              <div className="text-gray-300 text-xs">VIRTUAL CARD</div>
                            </div>
                            <div className="w-12 h-10 rounded-md flex items-center justify-center">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </div>
                          </div>

                          {/* EMV Chip */}
                          <div className="w-12 h-10 mt-2">
                            <div className="w-12 h-9 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md flex items-center justify-center overflow-hidden">
                              <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-px">
                                {Array.from({ length: 9 }).map((_, i) => (
                                  <div key={i} className="bg-yellow-300/30 w-full h-full"></div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="text-white font-mono text-lg tracking-widest mb-2">{cardDetails.number}</div>
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="text-gray-300 text-xs mb-1">CARD HOLDER</div>
                                <div className="text-white text-sm">{cardDetails.name}</div>
                              </div>
                              <div>
                                <div className="text-gray-300 text-xs mb-1">EXPIRES</div>
                                <div className="text-white text-sm">{cardDetails.expiry}</div>
                              </div>
                              <div className="flex items-center">
                                <div className="text-yellow-400 font-bold text-lg">XRP</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Card Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              Card Number
                            </label>
                            <div className="flex">
                              <input
                                value={cardDetails.number}
                                readOnly
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg bg-gray-50 text-gray-900 font-mono"
                              />
                              <button
                                onClick={() => copyToClipboard(cardDetails.rawNumber)}
                                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              Card Holder
                            </label>
                            <input
                              value={cardDetails.name}
                              readOnly
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              Expiry Date
                            </label>
                            <input
                              value={cardDetails.expiry}
                              readOnly
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              CVV
                            </label>
                            <input
                              value={cardDetails.cvv}
                              readOnly
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-center pt-6">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => router.push('/card')}
                          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all duration-300"
                        >
                          <span>✨</span>
                          <span>View Card Dashboard</span>
                        </motion.button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
