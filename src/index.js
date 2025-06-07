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
}

module.exports = FixedAccountDID;
