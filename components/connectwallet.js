import React from 'react';
import { createPortal } from 'react-dom';
import sdk from '@crossmarkio/sdk';

export default function ConnectWallet({ open, onClose, onSelectWallet }) {
  if (!open) return null;

  const handleCrossmarkConnect = async () => {
    try {
      const { response } = await sdk.methods.signInAndWait();
      if (response?.data?.address) {
        onSelectWallet('crossmart', response.data.address);
      }
    } catch (error) {
      console.error('Error connecting to Crossmark:', error);
    }
  };

  const handleMetaMaskConnect = async () => {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask to use this feature');
        return;
      }

      // Check if the provider is MetaMask
      if (!window.ethereum.isMetaMask) {
        alert('Please use MetaMask wallet');
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (accounts && accounts.length > 0) {
        onSelectWallet('metamask', accounts[0]);
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      if (error.code === 4001) {
        // User rejected the connection
        alert('Please connect your MetaMask wallet to continue');
      } else {
        alert('Error connecting to MetaMask. Please try again.');
      }
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-xs relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-6 text-center text-black">Connect Wallet</h2>
        <div className="flex flex-col space-y-4">
          <button
            className="flex items-center space-x-3 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
            onClick={handleMetaMaskConnect}
          >
            <img src="/fox.png" alt="MetaMask" className="w-8 h-8" />
            <span className="font-medium text-black">MetaMask</span>
          </button>
          <button
            className="flex items-center space-x-3 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
            onClick={handleCrossmarkConnect}
          >
            <img src="/crossmart.png" alt="Crossmart" className="w-8 h-8" />
            <span className="font-medium text-black">Crossmart Wallet</span>
          </button>
        </div>
      </div>
    </div>,
    typeof window !== 'undefined' ? document.body : null
  );
}
