const KYCBasedDIDSystem = require("../../src/kyc-did-system.js");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const kycSystem = new KYCBasedDIDSystem();

  try {
    console.log("🚀 Starting KYC processing...");
    const {
      personalInfo,
      identityDocuments,
      addressData,
      addressProofDocument,
      financialInfo,
      consents,
    } = req.body;

    // Connect to XRPL
    await kycSystem.connect();

    // Step 1: Collect Personal Information with defaults
    console.log("📋 Processing personal information...");
    const defaultPersonalInfo = {
      firstName: personalInfo?.firstName || "John",
      lastName: personalInfo?.lastName || "Doe",
      dateOfBirth: personalInfo?.dateOfBirth || "1990-01-01",
      nationality: personalInfo?.nationality || "United States",
      phoneNumber: personalInfo?.phoneNumber || "+1-555-0123",
      email: personalInfo?.email || "test@example.com",
      gender: personalInfo?.gender || "male",
      placeOfBirth: personalInfo?.placeOfBirth || "New York, NY",
      ...personalInfo,
    };
    await kycSystem.collectPersonalInfo(defaultPersonalInfo);

    // Step 2: Verify Identity Documents with defaults
    console.log("🆔 Processing identity documents...");
    const defaultIdentityDocuments = identityDocuments?.length
      ? identityDocuments
      : [
          {
            type: "government_id",
            documentNumber: "DL123456789",
            issueDate: "2020-01-01",
            expiryDate: "2025-01-01",
            issuingAuthority: "Test Authority",
          },
        ];
    await kycSystem.verifyIdentityDocuments(defaultIdentityDocuments);

    // Step 3: Verify Address with defaults
    console.log("🏠 Processing address verification...");
    const defaultAddressData = {
      street: addressData?.street || "123 Main Street",
      city: addressData?.city || "New York",
      state: addressData?.state || "NY",
      postalCode: addressData?.postalCode || "10001",
      country: addressData?.country || "US",
      ...addressData,
    };
    const defaultAddressProof = {
      type: "utility_bill",
      issueDate: new Date().toISOString().split("T")[0],
      ...addressProofDocument,
    };
    await kycSystem.verifyAddress(defaultAddressData, defaultAddressProof);

    // Step 4: Collect Financial Information with defaults
    console.log("💰 Processing financial information...");
    const defaultFinancialInfo = {
      incomeRange: financialInfo?.incomeRange || "50000-75000",
      employmentStatus: financialInfo?.employmentStatus || "employed",
      sourceOfFunds: financialInfo?.sourceOfFunds || "salary",
      employer: financialInfo?.employer || "Test Company",
      ...financialInfo,
    };
    await kycSystem.collectFinancialInfo(defaultFinancialInfo);

    // Step 5: Link Debit Card (simulate with dummy data)
    console.log("💳 Processing payment method...");
    await kycSystem.linkDebitCard({
      cardNumber: "4111111111111234", // Dummy card for demo
      bankName: "Demo Bank",
      cardType: "debit",
    });

    // Step 6: Collect Consents with defaults
    console.log("✅ Processing consents...");
    const defaultConsents = {
      dataProcessing: consents?.dataProcessing || true,
      kycVerification: consents?.kycVerification || true,
      dataSharing: consents?.dataSharing || true,
      termsOfService: consents?.termsOfService || true,
      privacyPolicy: consents?.privacyPolicy || true,
      ipAddress: "unknown",
      ...consents,
    };
    await kycSystem.collectConsents(defaultConsents);

    // Complete KYC and Create DID
    console.log("🎯 Completing KYC and creating DID...");
    const result = await kycSystem.completeKYCAndCreateDID();

    console.log("✅ KYC completed successfully!");

    // Disconnect from XRPL
    await kycSystem.disconnect();

    // Return the real result
    res.status(200).json({
      success: true,
      did: result.did,
      address: result.address,
      verifiableCredentials: Object.keys(result.verifiableCredentials),
      publishResult: result.publishResult,
      kycTimestamp: result.kycTimestamp,
    });
  } catch (error) {
    console.error("❌ KYC processing failed:", error);

    // Always disconnect on error
    try {
      await kycSystem.disconnect();
    } catch (disconnectError) {
      console.error("Error disconnecting:", disconnectError);
    }

    res.status(500).json({
      success: false,
      error: error.message,
      details: error.stack,
    });
  }
}
