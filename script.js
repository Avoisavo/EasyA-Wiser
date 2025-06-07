import { Client, Wallet } from "xrpl";

// To test pathfinding the best way is to use MainNet as we need active trading on the currencies. 
// You can do this on testnet, this would require to make an active market between Currency 1 <> XRP <> Currency 2
const client = new Client("wss://s.altnet.rippletest.net:51233/");

async function runPathfinding() {
    try {
        await client.connect();
        console.log("Connected to XRPL Testnet");

        // Initialize the wallets
        // The source and destination address can be the same, you will now effectively swap between a currency pair
        const sourceWallet = Wallet.fromSeed(process.env.SOURCE_WALLET_SEED);  // Replace with your source wallet seed
        const destinationWallet = Wallet.fromSeed(process.env.DESTINATION_WALLET_SEED);  // Replace with your destination wallet seed

        console.log("Source Wallet Address:", sourceWallet.classicAddress);
        console.log("Destination Wallet Address:", destinationWallet.classicAddress);

        // ✅ CHANGED: RLUSD to XRP pathfinding (reverse direction)
        const pathfindRequest = {
            command: "ripple_path_find",
            source_account: sourceWallet.classicAddress,  // Sender's account
            destination_account: destinationWallet.classicAddress, // Receiver's account
            destination_amount: "100000", // ✅ FIXED COMMENT: 0.1 XRP in drops (0.1 × 1,000,000)
            source_currencies: [{
                currency: "524C555344000000000000000000000000000000", // ✅ CHANGED: RLUSD as source
                issuer: "rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV" // RLUSD issuer
            }],
            ledger_index: "validated"
        };

        console.log("Starting RLUSD → XRP pathfinding...");
        console.log("Source: RLUSD tokens");
        console.log("Destination: 0.1 XRP"); // ✅ FIXED: Changed from "10 XRP"
        console.log("RLUSD Currency (hex):", "524C555344000000000000000000000000000000");
        console.log("RLUSD Issuer:", "rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV");
        
        const paths = await client.request(pathfindRequest);
        console.log('Available Paths:', paths.result.alternatives);

        if (paths.result.alternatives && paths.result.alternatives.length > 0) {
            // Use the first available path
            const selectedPath = paths.result.alternatives[0];
            console.log("Selected path:", selectedPath);
            console.log("Source amount needed (RLUSD):", selectedPath.source_amount);

            // ✅ CHANGED: RLUSD to XRP payment
            const paymentTransaction = {
                TransactionType: "Payment",
                Account: sourceWallet.classicAddress,
                Destination: destinationWallet.classicAddress,
                Amount: "100000", // ✅ CORRECT: 0.1 XRP in drops
                SendMax: selectedPath.source_amount, // ✅ CHANGED: RLUSD amount needed
                Paths: selectedPath.paths_computed
            };

            console.log("Executing RLUSD → XRP payment...");
            console.log("Sending max RLUSD:", selectedPath.source_amount);
            console.log("Destination will receive: 0.1 XRP"); // ✅ FIXED: Changed from "10 XRP"

            const response = await client.submitAndWait(paymentTransaction, { 
                autofill: true, 
                wallet: sourceWallet 
            });
            
            console.log('Transaction Result:', response.result.meta.TransactionResult);
            console.log('Transaction Hash:', response.result.hash);
            
            if (response.result.meta.TransactionResult === "tesSUCCESS") {
                console.log('✅ Payment successful!');
            } else {
                console.log('❌ Payment failed:', response.result.meta.TransactionResult);
            }
            
            console.log('Full Response:', response);

        } else {
            console.log("No paths found for RLUSD → XRP");
            console.log("💡 This is expected on testnet due to limited liquidity");
            console.log("💡 RLUSD → XRP market may not be active on testnet");
            
            if (paths.result.destination_currencies) {
                console.log("💡 Available destination currencies:", paths.result.destination_currencies);
            }
        }

    } catch (error) {
        console.error('Error during pathfinding:', error);
        
        if (error.data && error.data.error_code) {
            console.error('Error code:', error.data.error_code);
            console.error('Error message:', error.data.error_message);
        }
    } finally {
        await client.disconnect();
        console.log("Disconnected from XRPL");
    }
}

// Run the pathfinding script
runPathfinding();
