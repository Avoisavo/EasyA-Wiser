import { ethers } from 'ethers';

// Arbitrum Sepolia network configuration
const ARBITRUM_SEPOLIA_CONFIG = {
  chainId: '0x66eee', // 421614 in hex
  chainName: 'Arbitrum Sepolia',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
  blockExplorerUrls: ['https://sepolia.arbiscan.io/'],
};

export class EthereumTransferUtils {
  constructor() {
    this.provider = null;
    this.signer = null;
  }

  // Check if MetaMask is installed
  isMetaMaskInstalled() {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  }

  // Switch to Arbitrum Sepolia network
  async switchToArbitrumSepolia() {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }

    try {
      // Try to switch to the network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ARBITRUM_SEPOLIA_CONFIG.chainId }],
      });
    } catch (switchError) {
      // If the network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [ARBITRUM_SEPOLIA_CONFIG],
          });
        } catch (addError) {
          throw new Error('Failed to add Arbitrum Sepolia network');
        }
      } else {
        throw new Error('Failed to switch to Arbitrum Sepolia network');
      }
    }
  }

  // Initialize provider and signer
  async initializeProvider() {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }

    // Switch to Arbitrum Sepolia first
    await this.switchToArbitrumSepolia();

    // Create provider and signer
    this.provider = new ethers.BrowserProvider(window.ethereum);
    this.signer = await this.provider.getSigner();

    return this.signer;
  }

  // Get current network
  async getCurrentNetwork() {
    if (!this.provider) {
      await this.initializeProvider();
    }
    return await this.provider.getNetwork();
  }

  // Get ETH balance
  async getBalance(address) {
    if (!this.provider) {
      await this.initializeProvider();
    }
    const balance = await this.provider.getBalance(address);
    return ethers.formatEther(balance);
  }

  // Estimate gas for transfer
  async estimateTransferGas(toAddress, amount) {
    if (!this.signer) {
      await this.initializeProvider();
    }

    const tx = {
      to: toAddress,
      value: ethers.parseEther(amount.toString()),
    };

    const gasLimit = await this.signer.estimateGas(tx);
    const feeData = await this.provider.getFeeData();
    
    return {
      gasLimit: gasLimit.toString(),
      gasPrice: feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') : '0',
      maxFeePerGas: feeData.maxFeePerGas ? ethers.formatUnits(feeData.maxFeePerGas, 'gwei') : '0',
      estimatedCost: feeData.gasPrice ? ethers.formatEther(gasLimit * feeData.gasPrice) : '0',
    };
  }

  // Send ETH transfer
  async sendTransfer(toAddress, amount) {
    if (!this.signer) {
      await this.initializeProvider();
    }

    // Verify we're on the correct network
    const network = await this.getCurrentNetwork();
    if (network.chainId !== 421614n) { // Arbitrum Sepolia chain ID
      throw new Error('Please switch to Arbitrum Sepolia network');
    }

    const tx = {
      to: toAddress,
      value: ethers.parseEther(amount.toString()),
    };

    console.log('Sending transaction:', tx);
    
    // Send the transaction
    const transaction = await this.signer.sendTransaction(tx);
    
    console.log('Transaction sent:', transaction.hash);
    
    // Wait for confirmation
    const receipt = await transaction.wait();
    
    console.log('Transaction confirmed:', receipt);
    
    return {
      hash: transaction.hash,
      receipt: receipt,
      explorerUrl: `https://sepolia.arbiscan.io/tx/${transaction.hash}`,
    };
  }

  // Send transaction to specific address with fixed amount
  async sendToTargetAddress(userAddress) {
    const TARGET_ADDRESS = '0xEE094A71d8A47db268A35Ae3d3a2835113D0977e';
    const AMOUNT = '0.0004'; // ETH

    try {
      // Check user balance first
      const balance = await this.getBalance(userAddress);
      console.log(`User balance: ${balance} ETH`);

      if (parseFloat(balance) < parseFloat(AMOUNT)) {
        throw new Error(`Insufficient balance. You have ${balance} ETH, but need at least ${AMOUNT} ETH plus gas fees.`);
      }

      // Get gas estimate
      const gasEstimate = await this.estimateTransferGas(TARGET_ADDRESS, AMOUNT);
      console.log('Gas estimate:', gasEstimate);

      // Check if user has enough for gas + transfer
      const totalNeeded = parseFloat(AMOUNT) + parseFloat(gasEstimate.estimatedCost);
      if (parseFloat(balance) < totalNeeded) {
        throw new Error(`Insufficient balance for transfer + gas. Need ~${totalNeeded.toFixed(6)} ETH total.`);
      }

      // Send the transfer
      const result = await this.sendTransfer(TARGET_ADDRESS, AMOUNT);
      
      return {
        success: true,
        amount: AMOUNT,
        recipient: TARGET_ADDRESS,
        ...result,
      };

    } catch (error) {
      console.error('Transfer failed:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const transferUtils = new EthereumTransferUtils(); 