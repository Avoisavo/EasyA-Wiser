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

  /**
   * Submit DID URI transaction to XRPL
   */
  async submitDIDUriTransaction(didUri) {
    try {
      const didUriHex = Buffer.from(didUri, "utf8")
        .toString("hex")
        .toUpperCase();

      // Get account info and current ledger
      const accountResponse = await this.client.request({
        command: "account_info",
        account: this.wallet.address,
        ledger_index: "validated",
      });

      const ledgerResponse = await this.client.request({
        command: "ledger_current",
      });

      // Create transaction with URI field
      const transaction = {
        Account: this.wallet.address,
        TransactionType: "DIDSet",
        Fee: xrpToDrops("0.0001"),
        Sequence: accountResponse.result.account_data.Sequence,
        LastLedgerSequence: ledgerResponse.result.ledger_current_index + 15,
        URI: didUriHex,
      };

      console.log("📄 Transaction details:", {
        Account: transaction.Account,
        TransactionType: transaction.TransactionType,
        Fee: transaction.Fee,
        Sequence: transaction.Sequence,
        URI: didUri,
      });

      // Sign and submit
      const signed = this.wallet.sign(transaction);
      const submitResult = await this.client.request({
        command: "submit",
        tx_blob: signed.tx_blob,
      });

      console.log("📤 Submit result:", submitResult.result.engine_result);

      if (submitResult.result.engine_result === "tesSUCCESS") {
        console.log("✅ Transaction submitted successfully");

        // Wait for validation
        console.log("⏳ Waiting for validation...");
        await new Promise((resolve) => setTimeout(resolve, 5000));

        return signed.hash;
      } else {
        throw new Error(
          `Transaction failed: ${submitResult.result.engine_result}`
        );
      }
    } catch (error) {
      console.error("Error submitting URI transaction:", error);
      throw error;
    }
  }

  /**
   * Resolve DID from testnet
   */
  async resolveDID() {
    try {
      console.log(`🔍 Looking for DID on testnet...`);

      const response = await this.client.request({
        command: "account_objects",
        account: this.wallet.address,
        ledger_index: "validated",
        type: "DID",
      });

      if (
        !response.result.account_objects ||
        response.result.account_objects.length === 0
      ) {
        throw new Error("No DID found for this address");
      }

      const didObject = response.result.account_objects[0];
      let didInfo = {
        did: `did:xrpl:${this.wallet.address}`,
        address: this.wallet.address,
      };

      if (didObject.DIDDocument) {
        const didDocumentString = Buffer.from(
          didObject.DIDDocument,
          "hex"
        ).toString("utf8");
        didInfo.document = JSON.parse(didDocumentString);
      }

      if (didObject.URI) {
        didInfo.uri = Buffer.from(didObject.URI, "hex").toString("utf8");
      }

      console.log("✅ DID found on testnet!");
      return didInfo;
    } catch (error) {
      console.error("❌ Error resolving DID:", error);
      throw error;
    }
  }

  /**
   * Create and publish DID to XRPL testnet
   */
  async createAndPublishDID() {
    try {
      // Check if DID already exists
      try {
        const existingDID = await this.resolveDID();
        console.log("✅ DID already exists on testnet!");
        return {
          success: true,
          did: existingDID.did,
          address: existingDID.address,
          alreadyExists: true,
          didInfo: existingDID,
        };
      } catch (error) {
        console.log("📝 DID not found, creating new one...");
      }

      // Create simple URI instead of full document (to avoid size issues)
      const did = `did:xrpl:${this.wallet.address}`;
      const didUri = `https://whereismylunch.com/did/${this.wallet.address}`;

      console.log("📄 Creating DID with URI...");

      // Publish to testnet using URI approach
      console.log("🚀 Publishing DID to XRPL testnet...");
      const txHash = await this.submitDIDUriTransaction(didUri);

      console.log("✅ DID published successfully!");
      console.log(`- Transaction Hash: ${txHash}`);
      console.log(
        `- Explorer: https://testnet.xrpl.org/transactions/${txHash}`
      );

      return {
        success: true,
        did: did,
        address: this.wallet.address,
        transactionHash: txHash,
        explorerUrl: `https://testnet.xrpl.org/transactions/${txHash}`,
        alreadyExists: false,
        didUri: didUri,
      };
    } catch (error) {
      console.error("❌ Error creating and publishing DID:", error);
      throw error;
    }
  }

  /**
   * Complete process: create wallet, fund, publish DID, verify
   */
  async runCompleteProcess() {
    try {
      console.log("🎯 Starting Fixed Account DID Process\n");

      // Step 1: Create fixed wallet
      console.log("1️⃣ Creating deterministic wallet...");
      const walletInfo = this.createFixedWallet();

      // Step 2: Ensure funding
      console.log("\n2️⃣ Ensuring wallet has funds...");
      await this.ensureFunding();

      // Step 3: Create and publish DID
      console.log("\n3️⃣ Creating and publishing DID...");
      const didResult = await this.createAndPublishDID();

      // Step 4: Verify DID can be found
      console.log("\n4️⃣ Verifying DID can be found...");
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait a bit
      const foundDID = await this.resolveDID();

      // Summary
      console.log("\n" + "=".repeat(60));
      console.log("🎉 SUCCESS! Fixed Account DID System Working!");
      console.log("=".repeat(60));
      console.log(`✅ Username: ${walletInfo.username}`);
      console.log(`✅ Address: ${walletInfo.address}`);
      console.log(`✅ DID: ${walletInfo.did}`);
      console.log(`✅ DID Published: ${didResult.success}`);
      console.log(`✅ DID Found: ${foundDID ? "YES" : "NO"}`);

      if (!didResult.alreadyExists) {
        console.log(`✅ Transaction: ${didResult.transactionHash}`);
        console.log(`✅ Explorer: ${didResult.explorerUrl}`);
      }

      console.log(
        `✅ Account Explorer: https://testnet.xrpl.org/accounts/${walletInfo.address}`
      );
      console.log(
        "\n💡 Run this script again - it will create the SAME DID every time!"
      );

      return {
        wallet: walletInfo,
        didResult: didResult,
        foundDID: foundDID,
        explorerUrls: {
          account: `https://testnet.xrpl.org/accounts/${walletInfo.address}`,
          transaction: didResult.alreadyExists ? null : didResult.explorerUrl,
        },
      };
    } catch (error) {
      console.error("❌ Process failed:", error.message);
      throw error;
    }
  }
}

module.exports = FixedAccountDID;
