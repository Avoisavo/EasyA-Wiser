const FixedAccountDID = require("./index.js");

async function main() {
  console.log("Fixed Account DID System Demo");
  console.log("=".repeat(50));
  console.log("Username: alice_whereismylunch");
  console.log("Password: mySecurePassword123");
  console.log("=".repeat(50) + "\n");

  const didSystem = new FixedAccountDID();

  try {
    await didSystem.connect();

    const result = await didSystem.runCompleteProcess();

    console.log("\n🔄 Testing deterministic behavior...");
    console.log("Creating a NEW instance with same credentials...");

    const didSystem2 = new FixedAccountDID();
    await didSystem2.connect();

    const walletInfo2 = didSystem2.createFixedWallet();
    console.log(
      `✅ Same address generated: ${
        walletInfo2.address === result.wallet.address
      }`
    );
    console.log(
      `✅ Same DID generated: ${walletInfo2.did === result.wallet.did}`
    );

    await didSystem2.disconnect();
  } catch (error) {
    console.error("❌ Demo failed:", error.message);
  } finally {
    await didSystem.disconnect();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
