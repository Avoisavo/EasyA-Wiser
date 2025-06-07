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

        // Set up pathfinding listener
        client.on('path_find', (path_find) => {
            console.log('New path found:', path_find);
        });

        // XRP to RLUSD pathfinding
        const pathfindRequest = {
            command: "path_find",
            subcommand: "create",
            source_account: sourceWallet.classicAddress,  // Sender's account
            destination_account: destinationWallet.classicAddress, // Receiver's account
            destination_amount: {
                currency: "524C555344000000000000000000000000000000", // RLUSD in hex format
                value: "1", // 10 RLUSD destination amount
                issuer: "rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV" // RLUSD issuer from docs
            },
            source_currencies: [{
                currency: "XRP" // Native XRP as source
            }]
        };

        console.log("Starting XRP → RLUSD pathfinding...");
        console.log("Source: Native XRP");
        console.log("Destination: 10 RLUSD");
        console.log("RLUSD Currency (hex):", "524C555344000000000000000000000000000000");
        console.log("RLUSD Issuer:", "rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV");
        const paths = await client.request(pathfindRequest);
        console.log('Available Paths:', paths.result.alternatives);

        if (paths.result.alternatives && paths.result.alternatives.length > 0) {
            // Use the first available path
            const selectedPath = paths.result.alternatives[0];
            console.log("Selected path:", selectedPath);
            console.log("Source amount needed (XRP drops):", selectedPath.source_amount);

            // Send the Payment - XRP to RLUSD
            const paymentTransaction = {
                TransactionType: "Payment",
                Account: sourceWallet.classicAddress,
                Destination: destinationWallet.classicAddress,
                Amount: {
                    currency: "524C555344000000000000000000000000000000", // RLUSD in hex format
                    value: "-1",
                    issuer: "rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV" // RLUSD issuer
                },
                SendMax: selectedPath.source_amount, // XRP amount in drops (e.g., "13100000" for 13.1 XRP)
                Paths: selectedPath.paths_computed // Include computed path
            };

            console.log("Executing XRP → RLUSD payment...");
            console.log("Sending max XRP (drops):", selectedPath.source_amount);
            console.log("Destination will receive: 10 RLUSD");

            const response = await client.submitAndWait(paymentTransaction, { 
                autofill: true, 
                wallet: sourceWallet 
            });
            
            console.log('Transaction Result:', response.result.meta.TransactionResult);
            console.log('Transaction Hash:', response.result.hash);
            console.log('Full Response:', response);

        } else {
            console.log("No paths found for XRP → RLUSD");
            console.log("💡 This is expected on testnet due to limited liquidity");
            console.log("💡 XRP → RLUSD market may not be active on testnet");
        }

        // Don't forget to close it!
        await client.request({
            command: 'path_find',
            subcommand: 'close'
        });

        console.log("Pathfinding session closed");

    } catch (error) {
        console.error('Error during pathfinding:', error);
    } finally {
        await client.disconnect();
        console.log("Disconnected from XRPL");
    }
}

// Run the pathfinding script
runPathfinding();
