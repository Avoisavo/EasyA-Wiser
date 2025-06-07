const { Client, Wallet, xrpToDrops, dropsToXrp } = require("xrpl");
const crypto = require("crypto");

/**
 * Fixed Account DID System for XRPL
 * Always creates the same DID from fixed credentials
 */
class FixedAccountDID {
  constructor(networkUrl = "wss://s.altnet.rippletest.net:51233") {
    this.client = new Client(networkUrl);
    this.wallet = null;

    // FIXED CREDENTIALS - Always creates the same DID
    this.FIXED_USERNAME = "alice_whereismylunch";
    this.FIXED_PASSWORD = "mySecurePassword123";
  }

  /**
   * Connect to XRPL network
   */
  async connect() {
    try {
      await this.client.connect();
      console.log("✅ Connected to XRPL Testnet");
      return true;
    } catch (error) {
      console.error("❌ Failed to connect:", error);
      throw error;
    }
  }

  /**
   * Disconnect from XRPL network
   */
  async disconnect() {
    try {
      await this.client.disconnect();
      console.log("✅ Disconnected from XRPL");
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
  }

  /**
   * Create deterministic wallet from fixed credentials
   * Always creates the same wallet/address/DID
   */
  createFixedWallet() {
    try {
      // Create deterministic seed from fixed credentials
      const credentialString = `${this.FIXED_USERNAME}:${this.FIXED_PASSWORD}:xrpl-did-system`;
      const hash = crypto
        .createHash("sha256")
        .update(credentialString)
        .digest();

      // Create wallet from entropy (32 bytes)
      this.wallet = Wallet.fromEntropy(hash);

      const walletInfo = {
        username: this.FIXED_USERNAME,
        address: this.wallet.address,
        seed: this.wallet.seed,
        did: `did:xrpl:${this.wallet.address}`,
        publicKey: this.wallet.publicKey,
      };

      console.log("🔐 Fixed wallet created:");
      console.log(`- Username: ${walletInfo.username}`);
      console.log(`- Address: ${walletInfo.address}`);
      console.log(`- DID: ${walletInfo.did}`);

      return walletInfo;
    } catch (error) {
      console.error("Error creating fixed wallet:", error);
      throw error;
    }
  }

  /**
   * Check account balance and fund if needed
   */
  async ensureFunding() {
    try {
      let balance = 0;

      try {
        const response = await this.client.request({
          command: "account_info",
          account: this.wallet.address,
          ledger_index: "validated",
        });

        balance = parseFloat(dropsToXrp(response.result.account_data.Balance));
        console.log(`💰 Current balance: ${balance} XRP`);
      } catch (error) {
        if (error.message.includes("Account not found")) {
          console.log("🆕 New account - needs funding");
          balance = 0;
        } else {
          throw error;
        }
      }

      if (balance < 1) {
        console.log("💸 Funding wallet from testnet faucet...");
        await this.client.fundWallet(this.wallet);
        console.log("✅ Wallet funded successfully");
        return 10; // Default testnet funding
      }

      return balance;
    } catch (error) {
      console.error("Error ensuring funding:", error);
      throw error;
    }
  }
}

module.exports = FixedAccountDID;
