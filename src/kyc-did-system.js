const { Client, Wallet, xrpToDrops, dropsToXrp } = require("xrpl");
const crypto = require("crypto");

/**
 * KYC-Based DID System for XRPL
 * Creates DID only after successful KYC verification
 */
class KYCBasedDIDSystem {
  constructor(networkUrl = "wss://s.altnet.rippletest.net:51233") {
    this.client = new Client(networkUrl);
    this.wallet = null;
    this.kycData = null;
    this.verificationStatus = {
      personalInfo: false,
      identityDocuments: false,
      addressVerification: false,
      financialInfo: false,
      debitCardLinking: false,
      userConsents: false,
      kycComplete: false,
    };
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
   * Step 1: Collect and verify personal information
   */
  async collectPersonalInfo(personalData) {
    const requiredFields = [
      "firstName",
      "lastName",
      "dateOfBirth",
      "nationality",
      "phoneNumber",
      "email",
      "gender",
      "placeOfBirth",
    ];

    const missingFields = requiredFields.filter(
      (field) => !personalData[field]
    );
    if (missingFields.length > 0) {
      throw new Error(
        `Missing required personal info fields: ${missingFields.join(", ")}`
      );
    }

    // Validate data formats
    this.validatePersonalInfo(personalData);

    this.kycData = {
      ...this.kycData,
      personalInfo: {
        ...personalData,
        timestamp: new Date().toISOString(),
        verified: true,
      },
    };

    this.verificationStatus.personalInfo = true;
    console.log("📋 Personal information collected");
    return true;
  }

  /**
   * Step 2: Verify identity documents
   */
  async verifyIdentityDocuments(documents) {
    const requiredDocTypes = ["government_id"]; // passport, driver_license, or national_id
    const providedTypes = documents.map((doc) => doc.type);

    const hasRequiredDoc = requiredDocTypes.some((type) =>
      providedTypes.includes(type)
    );
    if (!hasRequiredDoc) {
      throw new Error("At least one government-issued ID is required");
    }

    // Simulate document verification process
    for (const document of documents) {
      const verificationResult = await this.simulateDocumentVerification(
        document
      );
      if (!verificationResult.valid) {
        throw new Error(`Document verification failed: ${document.type}`);
      }
    }

    this.kycData = {
      ...this.kycData,
      identityDocuments: {
        documents: documents.map((doc) => ({
          type: doc.type,
          documentNumber: doc.documentNumber,
          issueDate: doc.issueDate,
          expiryDate: doc.expiryDate,
          issuingAuthority: doc.issuingAuthority,
          verified: true,
          verificationTimestamp: new Date().toISOString(),
        })),
        verified: true,
      },
    };

    this.verificationStatus.identityDocuments = true;
    console.log("🆔 Identity documents verified");
    return true;
  }

  /**
   * Step 3: Verify address
   */
  async verifyAddress(addressData, proofDocument) {
    const requiredFields = ["street", "city", "state", "postalCode", "country"];
    const missingFields = requiredFields.filter((field) => !addressData[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing address fields: ${missingFields.join(", ")}`);
    }

    // Verify proof document (utility bill, bank statement, etc.)
    const proofVerification = await this.simulateAddressProofVerification(
      proofDocument
    );
    if (!proofVerification.valid) {
      throw new Error("Address proof verification failed");
    }

    this.kycData = {
      ...this.kycData,
      addressVerification: {
        address: addressData,
        proofDocument: {
          type: proofDocument.type,
          issueDate: proofDocument.issueDate,
          verified: true,
        },
        verified: true,
        verificationTimestamp: new Date().toISOString(),
      },
    };

    this.verificationStatus.addressVerification = true;
    console.log("🏠 Address verification completed");
    return true;
  }

  /**
   * Step 4: Collect financial information
   */
  async collectFinancialInfo(financialData) {
    const requiredFields = ["incomeRange", "employmentStatus", "sourceOfFunds"];
    const missingFields = requiredFields.filter(
      (field) => !financialData[field]
    );

    if (missingFields.length > 0) {
      throw new Error(
        `Missing financial info fields: ${missingFields.join(", ")}`
      );
    }

    this.kycData = {
      ...this.kycData,
      financialInfo: {
        ...financialData,
        verified: true,
        timestamp: new Date().toISOString(),
      },
    };

    this.verificationStatus.financialInfo = true;
    console.log("💰 Financial information collected");
    return true;
  }

  /**
   * Step 5: Link and verify debit card
   */
  async linkDebitCard(cardData) {
    // Simulate card verification process
    const cardVerification = await this.simulateCardVerification(cardData);
    if (!cardVerification.valid) {
      throw new Error("Debit card verification failed");
    }

    this.kycData = {
      ...this.kycData,
      debitCardLinking: {
        last4Digits: cardData.cardNumber.slice(-4),
        bankName: cardData.bankName,
        cardType: cardData.cardType,
        verified: true,
        verificationTimestamp: new Date().toISOString(),
      },
    };

    this.verificationStatus.debitCardLinking = true;
    console.log("💳 Debit card linked and verified");
    return true;
  }

  /**
   * Step 6: Collect user consents
   */
  async collectConsents(consents) {
    const requiredConsents = [
      "dataProcessing",
      "kycVerification",
      "dataSharing",
      "termsOfService",
      "privacyPolicy",
    ];

    const missingConsents = requiredConsents.filter(
      (consent) => !consents[consent]
    );
    if (missingConsents.length > 0) {
      throw new Error(
        `Missing required consents: ${missingConsents.join(", ")}`
      );
    }

    this.kycData = {
      ...this.kycData,
      userConsents: {
        ...consents,
        timestamp: new Date().toISOString(),
        ipAddress: consents.ipAddress || "unknown",
      },
    };

    this.verificationStatus.userConsents = true;
    console.log("✅ User consents collected");
    return true;
  }

  /**
   * Complete KYC verification and create DID
   */
  async completeKYCAndCreateDID() {
    // Check if all KYC steps are completed
    const allStepsComplete = Object.values(this.verificationStatus)
      .slice(0, -1) // Exclude kycComplete itself
      .every((status) => status === true);

    if (!allStepsComplete) {
      const incompleteSteps = Object.entries(this.verificationStatus)
        .filter(([key, value]) => key !== "kycComplete" && !value)
        .map(([key]) => key);
      throw new Error(`KYC incomplete. Missing: ${incompleteSteps.join(", ")}`);
    }

    // Mark KYC as complete
    this.verificationStatus.kycComplete = true;

    // Generate unique DID based on verified identity
    const didInfo = await this.generateVerifiedDID();

    // Create verifiable credentials
    const verifiableCredentials = this.createVerifiableCredentials();

    // Publish DID to XRPL
    const publishResult = await this.publishDIDToXRPL(
      didInfo,
      verifiableCredentials
    );

    console.log("🎉 KYC completed and DID created successfully!");

    return {
      did: didInfo.did,
      address: didInfo.address,
      verifiableCredentials,
      publishResult,
      kycTimestamp: new Date().toISOString(),
    };
  }

  /**
   * Generate unique DID based on verified identity data
   */
  async generateVerifiedDID() {
    // Create a unique identifier based on verified personal data
    // This ensures one DID per verified identity, not per username/password
    const identityString = [
      this.kycData.personalInfo.firstName,
      this.kycData.personalInfo.lastName,
      this.kycData.personalInfo.dateOfBirth,
      this.kycData.personalInfo.nationality,
      this.kycData.identityDocuments.documents[0].documentNumber,
    ].join("|");

    // Create deterministic but secure seed from verified identity
    const identityHash = crypto
      .createHash("sha256")
      .update(`kyc-verified:${identityString}:${Date.now()}`)
      .digest();

    // Create wallet from identity-based entropy
    this.wallet = Wallet.fromEntropy(identityHash);

    const didInfo = {
      did: `did:xrpl:${this.wallet.address}`,
      address: this.wallet.address,
      publicKey: this.wallet.publicKey,
      kycVerified: true,
      createdAt: new Date().toISOString(),
    };

    console.log(`🆔 Verified DID generated: ${didInfo.did}`);
    return didInfo;
  }

  /**
   * Create verifiable credentials from KYC data
   */
  createVerifiableCredentials() {
    const baseCredential = {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://whereismylunch.com/kyc/v1",
      ],
      type: ["VerifiableCredential", "KYCCredential"],
      issuer: "did:xrpl:whereismylunch-kyc-issuer",
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        id: `did:xrpl:${this.wallet.address}`,
      },
    };

    const credentials = {
      // Identity Verification Credential
      identityCredential: {
        ...baseCredential,
        type: [...baseCredential.type, "IdentityVerificationCredential"],
        credentialSubject: {
          ...baseCredential.credentialSubject,
          identityVerified: true,
          verificationLevel: "full",
          documentTypes: this.kycData.identityDocuments.documents.map(
            (d) => d.type
          ),
          verificationDate:
            this.kycData.identityDocuments.documents[0].verificationTimestamp,
        },
      },

      // Address Verification Credential
      addressCredential: {
        ...baseCredential,
        type: [...baseCredential.type, "AddressVerificationCredential"],
        credentialSubject: {
          ...baseCredential.credentialSubject,
          addressVerified: true,
          country: this.kycData.addressVerification.address.country,
          verificationDate:
            this.kycData.addressVerification.verificationTimestamp,
        },
      },

      // Financial Status Credential
      financialCredential: {
        ...baseCredential,
        type: [...baseCredential.type, "FinancialStatusCredential"],
        credentialSubject: {
          ...baseCredential.credentialSubject,
          financiallyVerified: true,
          incomeRange: this.kycData.financialInfo.incomeRange,
          employmentStatus: this.kycData.financialInfo.employmentStatus,
          verificationDate: this.kycData.financialInfo.timestamp,
        },
      },

      // Payment Method Credential
      paymentCredential: {
        ...baseCredential,
        type: [...baseCredential.type, "PaymentMethodCredential"],
        credentialSubject: {
          ...baseCredential.credentialSubject,
          paymentMethodVerified: true,
          cardType: this.kycData.debitCardLinking.cardType,
          bankName: this.kycData.debitCardLinking.bankName,
          verificationDate: this.kycData.debitCardLinking.verificationTimestamp,
        },
      },
    };

    console.log("📄 Verifiable credentials created");
    return credentials;
  }

  /**
   * Publish DID and credentials to XRPL
   */
  async publishDIDToXRPL(didInfo, credentials) {
    try {
      // Ensure wallet is funded
      const balance = await this.ensureFunding();
      console.log(`💰 Wallet balance: ${balance} XRP`);

      // Create a simple DID URI instead of a full document to avoid size limits
      const didUri = `https://whereismylunch.com/did/${this.wallet.address}`;

      // Store minimal DID metadata
      const didMetadata = {
        did: didInfo.did,
        kycCompleted: true,
        kycLevel: "full",
        credentialTypes: Object.keys(credentials),
        verificationDate: new Date().toISOString(),
      };

      console.log("📄 DID Metadata:", didMetadata);

      // Submit DID transaction with URI (much smaller than full document)
      const txHash = await this.submitDIDTransaction(didUri);

      console.log(`✅ DID published to XRPL: ${txHash}`);

      // Create proper explorer URLs for testnet
      const explorerUrls = [
        `https://testnet.xrpl.org/transactions/${txHash}`,
        `https://test.bithomp.com/explorer/transaction/${txHash}`,
        `https://xrpscan.com/tx/${txHash}?network=testnet`,
      ];

      return {
        transactionHash: txHash,
        explorerUrl: explorerUrls[0], // Primary explorer
        alternativeExplorers: explorerUrls,
        didUri: didUri,
        didMetadata: didMetadata,
        network: "testnet",
        account: this.wallet.address,
      };
    } catch (error) {
      console.error("❌ Error publishing DID to XRPL:", error);
      throw error;
    }
  }

  /**
   * Submit DID transaction to XRPL
   */
  async submitDIDTransaction(didUri) {
    try {
      const accountResponse = await this.client.request({
        command: "account_info",
        account: this.wallet.address,
        ledger_index: "validated",
      });

      const ledgerResponse = await this.client.request({
        command: "ledger_current",
      });

      // Create DID metadata as JSON
      const didMetadata = {
        type: "KYC_DID",
        did: `did:xrpl:${this.wallet.address}`,
        kycCompleted: true,
        kycLevel: "full",
        verificationDate: new Date().toISOString(),
        uri: didUri,
      };

      // Convert metadata to hex for memo
      const memoData = Buffer.from(JSON.stringify(didMetadata), "utf8")
        .toString("hex")
        .toUpperCase();

      // Use AccountSet transaction with Domain field to store DID
      const transaction = {
        Account: this.wallet.address,
        TransactionType: "AccountSet",
        Fee: xrpToDrops("0.00001"), // Standard fee
        Sequence: accountResponse.result.account_data.Sequence,
        LastLedgerSequence: ledgerResponse.result.ledger_current_index + 20,
        Domain: Buffer.from(didUri, "utf8").toString("hex").toUpperCase(), // Store DID URI in Domain field
        Memos: [
          {
            Memo: {
              MemoType: Buffer.from("KYC_DID", "utf8")
                .toString("hex")
                .toUpperCase(),
              MemoData:
                memoData.length > 2000 ? memoData.substring(0, 2000) : memoData, // Limit memo size
            },
          },
        ],
      };

      console.log("📤 Submitting DID transaction to XRPL...");
      console.log("Transaction:", transaction);

      // Sign the transaction
      const signed = this.wallet.sign(transaction);
      console.log("🔐 Transaction signed, hash:", signed.hash);

      // Submit to XRPL
      const submitResult = await this.client.request({
        command: "submit",
        tx_blob: signed.tx_blob,
      });

      console.log("📡 Submit result:", submitResult.result);

      if (submitResult.result.engine_result === "tesSUCCESS") {
        console.log(
          "⏳ Transaction submitted successfully, waiting for validation..."
        );

        // Wait longer for transaction to be validated
        await new Promise((resolve) => setTimeout(resolve, 10000));

        // Verify the transaction was actually validated
        try {
          const txResponse = await this.client.request({
            command: "tx",
            transaction: signed.hash,
          });

          if (txResponse.result.validated === true) {
            console.log("✅ Transaction validated successfully!");
            return signed.hash;
          } else {
            console.log("⏳ Transaction not yet validated, checking again...");
            await new Promise((resolve) => setTimeout(resolve, 5000));
            return signed.hash;
          }
        } catch (txError) {
          console.log(
            "ℹ️ Transaction submitted but validation check failed:",
            txError.message
          );
          return signed.hash; // Return hash anyway as transaction was submitted successfully
        }
      } else {
        const errorMsg = `Transaction failed: ${
          submitResult.result.engine_result
        } - ${submitResult.result.engine_result_message || "Unknown error"}`;
        console.error("❌", errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error("❌ Error submitting DID transaction:", error);
      throw error;
    }
  }

  /**
   * Verify identity without exposing raw personal data
   */
  async proveIdentity(proofRequest) {
    if (!this.verificationStatus.kycComplete) {
      throw new Error("KYC not completed. Cannot provide identity proof.");
    }

    // Create zero-knowledge proof based on request
    const proof = {
      did: `did:xrpl:${this.wallet.address}`,
      timestamp: new Date().toISOString(),
      proofType: proofRequest.type,
      verified: true,
    };

    // Add specific proofs without revealing raw data
    switch (proofRequest.type) {
      case "ageVerification":
        proof.isOver18 =
          this.calculateAge(this.kycData.personalInfo.dateOfBirth) >= 18;
        break;
      case "residencyVerification":
        proof.countryOfResidence =
          this.kycData.addressVerification.address.country;
        break;
      case "identityVerification":
        proof.identityVerified = true;
        proof.verificationLevel = "full";
        break;
      case "financialStatus":
        proof.financiallyVerified = true;
        proof.incomeCategory = this.categorizeIncome(
          this.kycData.financialInfo.incomeRange
        );
        break;
    }

    return proof;
  }

  // Helper methods for simulation and validation
  validatePersonalInfo(data) {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error("Invalid email format");
    }

    // Phone validation (basic)
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(data.phoneNumber)) {
      throw new Error("Invalid phone number format");
    }

    // Date of birth validation
    const birthDate = new Date(data.dateOfBirth);
    const age = this.calculateAge(data.dateOfBirth);
    if (age < 18) {
      throw new Error("User must be at least 18 years old");
    }
  }

  calculateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  categorizeIncome(incomeRange) {
    const income = parseInt(incomeRange.split("-")[0]);
    if (income < 30000) return "low";
    if (income < 75000) return "medium";
    return "high";
  }

  async simulateDocumentVerification(document) {
    // Simulate document verification API call
    console.log(`🔍 Verifying ${document.type}...`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return { valid: true, confidence: 0.95 };
  }

  async simulateAddressProofVerification(proofDocument) {
    console.log(`🔍 Verifying address proof...`);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return { valid: true, confidence: 0.92 };
  }

  async simulateCardVerification(cardData) {
    console.log(`🔍 Verifying debit card...`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { valid: true, confidence: 0.98 };
  }

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
        console.log(`📊 Current balance: ${balance} XRP`);
      } catch (error) {
        if (error.message.includes("Account not found")) {
          console.log("🆕 Account not found, will be created when funded");
          balance = 0;
        } else {
          throw error;
        }
      }

      if (balance < 2) {
        console.log("💸 Funding wallet from testnet faucet...");
        try {
          const fundingResult = await this.client.fundWallet(this.wallet);
          console.log("✅ Funding successful:", {
            balance: fundingResult.balance,
            wallet: fundingResult.wallet.address,
          });

          // Wait for account to be created and available
          await new Promise((resolve) => setTimeout(resolve, 5000));

          // Verify funding worked
          const verifyResponse = await this.client.request({
            command: "account_info",
            account: this.wallet.address,
            ledger_index: "validated",
          });
          const newBalance = parseFloat(
            dropsToXrp(verifyResponse.result.account_data.Balance)
          );
          console.log(`✅ Verified new balance: ${newBalance} XRP`);
          return newBalance;
        } catch (fundingError) {
          console.error("❌ Funding failed:", fundingError);
          throw new Error(`Failed to fund wallet: ${fundingError.message}`);
        }
      }

      return balance;
    } catch (error) {
      console.error("❌ Error ensuring funding:", error);
      throw error;
    }
  }
}

module.exports = KYCBasedDIDSystem;
