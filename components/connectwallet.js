import React from 'react';
import { createPortal } from 'react-dom';
import { useWallet } from '../contexts/WalletContext';

export default function ConnectWallet({ open, onClose }) {
  const { connect } = useWallet();

  if (!open) return null;

  const handleConnect = async (type) => {
    const address = await connect(type);
    if (address) {
      onClose(); // Close the modal on successful connection
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
            onClick={() => handleConnect('metamask')}
          >
            <img src="/fox.png" alt="MetaMask" className="w-8 h-8" />
            <span className="font-medium text-black">MetaMask</span>
          </button>
          <button
            className="flex items-center space-x-3 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
            onClick={() => handleConnect('crossmark')}
          >
            <img src="/crossmart.png" alt="Crossmart" className="w-8 h-8" />
            <span className="font-medium text-black">Crossmart Wallet</span>
          </button>
        </div>
      </div>
    </div>,
    // Ensure this only runs on the client
    typeof window !== 'undefined' ? document.body : null
  );
}
