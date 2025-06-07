const KYCBasedDIDSystem = require("./kyc-did-system.js");

async function demonstrateKYCProcess() {
  console.log("🎯 KYC-Based DID System Demo");
  console.log("=".repeat(60));

  const kycSystem = new KYCBasedDIDSystem();

  try {
    await kycSystem.connect();

    // Step 1: Collect Personal Information
    console.log("\n1️⃣ Collecting Personal Information...");
    await kycSystem.collectPersonalInfo({
      firstName: "Alice",
      lastName: "Johnson",
      dateOfBirth: "1990-05-15",
      nationality: "US",
      phoneNumber: "+1-555-0123",
      email: "alice.johnson@email.com",
      gender: "female",
      placeOfBirth: "New York, NY",
    });

    // Step 2: Verify Identity Documents
    console.log("\n2️⃣ Verifying Identity Documents...");
    await kycSystem.verifyIdentityDocuments([
      {
        type: "government_id",
        documentNumber: "DL123456789",
        issueDate: "2020-01-15",
        expiryDate: "2025-01-15",
        issuingAuthority: "NY DMV",
      },
    ]);

    // Step 3: Verify Address
    console.log("\n3️⃣ Verifying Address...");
    await kycSystem.verifyAddress(
      {
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "US",
      },
      {
        type: "utility_bill",
        issueDate: "2024-01-01",
      }
    );

    // Step 4: Collect Financial Information
    console.log("\n4️⃣ Collecting Financial Information...");
    await kycSystem.collectFinancialInfo({
      incomeRange: "50000-75000",
      employmentStatus: "employed",
      sourceOfFunds: "salary",
      employer: "Tech Corp Inc",
    });

    // Step 5: Link Debit Card
    console.log("\n5️⃣ Linking Debit Card...");
    await kycSystem.linkDebitCard({
      cardNumber: "4111111111111234",
      bankName: "First National Bank",
      cardType: "debit",
    });

    // Step 6: Collect Consents
    console.log("\n6️⃣ Collecting User Consents...");
    await kycSystem.collectConsents({
      dataProcessing: true,
      kycVerification: true,
      dataSharing: true,
      termsOfService: true,
      privacyPolicy: true,
      ipAddress: "192.168.1.100",
    });

    // Complete KYC and Create DID
    console.log("\n7️⃣ Completing KYC and Creating DID...");
    const result = await kycSystem.completeKYCAndCreateDID();

    // Display Results
    console.log("\n" + "=".repeat(60));
    console.log("🎉 KYC COMPLETED - DID CREATED!");
    console.log("=".repeat(60));
    console.log(`✅ DID: ${result.did}`);
    console.log(`✅ Address: ${result.address}`);
    console.log(`✅ Transaction: ${result.publishResult.transactionHash}`);
    console.log(`✅ Explorer: ${result.publishResult.explorerUrl}`);
    console.log(
      `✅ Credentials: ${
        Object.keys(result.verifiableCredentials).length
      } types`
    );

    // Demonstrate Identity Proofs
    console.log("\n" + "=".repeat(60));
    console.log("🔐 TESTING IDENTITY PROOFS");
    console.log("=".repeat(60));

    const ageProof = await kycSystem.proveIdentity({ type: "ageVerification" });
    console.log("Age Verification:", ageProof);

    const residencyProof = await kycSystem.proveIdentity({
      type: "residencyVerification",
    });
    console.log("Residency Verification:", residencyProof);

    const identityProof = await kycSystem.proveIdentity({
      type: "identityVerification",
    });
    console.log("Identity Verification:", identityProof);

    console.log("\n✅ Demo completed successfully!");
  } catch (error) {
    console.error("❌ Demo failed:", error.message);
  } finally {
    await kycSystem.disconnect();
  }
}

if (require.main === module) {
  demonstrateKYCProcess().catch(console.error);
}

module.exports = { demonstrateKYCProcess };
