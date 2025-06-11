import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import ConnectWallet from './connectwallet';
import { useWallet } from '../contexts/WalletContext';

export default function Header() {
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const { isConnected, walletAddress, walletType, disconnect } = useWallet();

  // Function to truncate wallet address for display
  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="absolute top-4 left-4 right-4 z-50 backdrop-blur-md bg-white/70 border border-blue-100 rounded-2xl">
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
              Wiser
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
      <ConnectWallet
        open={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
      />
    </header>
  );
} 