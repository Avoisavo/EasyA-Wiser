import React, { createContext, useContext, useState, useEffect } from 'react';
import sdk from '@crossmarkio/sdk';

const WalletContext = createContext();

export function useWallet() {
  return useContext(WalletContext);
}

export function WalletProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletType, setWalletType] = useState(null);

  // On initial load, check localStorage for a saved session
  useEffect(() => {
    const storedWalletAddress = localStorage.getItem('walletAddress');
    const storedWalletType = localStorage.getItem('walletType');
    if (storedWalletAddress && storedWalletType) {
      setWalletAddress(storedWalletAddress);
      setWalletType(storedWalletType);
    }
  }, []);

  const connect = async (type) => {
    try {
      let address;
      if (type === 'metamask') {
        if (typeof window.ethereum === 'undefined' || !window.ethereum.isMetaMask) {
          alert('Please install MetaMask to use this feature.');
          return null;
        }
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          address = accounts[0];
        }
      } else if (type === 'crossmark') {
        const { response } = await sdk.methods.signInAndWait();
        if (response?.data?.address) {
          address = response.data.address;
        }
      }
      
      if (address) {
        setWalletAddress(address);
        setWalletType(type);
        localStorage.setItem('walletAddress', address);
        localStorage.setItem('walletType', type);
        return address;
      }
    } catch (error) {
        console.error(`Error connecting to ${type}:`, error);
        if (error.code === 4001) {
          alert(`Please connect your ${type} wallet to continue.`);
        } else {
          alert(`Error connecting to ${type}. Please try again.`);
        }
    }
    return null;
  };

  const disconnect = () => {
    setWalletAddress(null);
    setWalletType(null);
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('walletType');
  };

  const value = {
    walletAddress,
    walletType,
    isConnected: !!walletAddress,
    connect,
    disconnect,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
} 