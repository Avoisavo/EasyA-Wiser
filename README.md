# 💳 Wiser – XRPL-Powered Payment Infrastructure

**Wiser** is a decentralized payment infrastructure built on the **XRP Ledger (XRPL)** that empowers users to spend their crypto assets like cash without losing custody. By combining **DIDs**, **on-chain KYC**, **XRPL pathfinding**, and the **Marqeta sandbox API**, users can generate a fully-functional **debit card** without needing to pre-fund it.

Wiser gives users seamless and cost-effective access to real-world payments using their crypto holdings.

---

## 💡 Inspiration

Our team constantly juggle between fiat and crypto, and we were inspired by the inefficiencies and centralization in most Web3-to-fiat bridges:

1. **Crypto enthusiasts** can’t swipe at most merchants without off-ramp hassles.  
2. Why must users **preload a custodial** wallet to spend crypto?  

> “What if spending crypto felt exactly like swiping a debit card while the conversion happened seamlessly in the background?”  

That question sparked Wiser.

---

## ❗ Problem Statement

> Most crypto-backed debit cards require users to **pre-fund** fiat into a separate account or custodial wallet. This results in:
- Loss of user custody and control
- Centralized risk and delayed transactions
- Broken user experience that feels disconnected from the real-time, on-chain world

---

## 🔑 The Solution

- **Seamless Bridging** – seamless transfers from crypto to fiat.  
- **0 Pre-funding, 0 Staking** – no upfront capital lock ups or staking required.  
- **Truly Self-Custody** – users always retain full control of their funds.  
- **Global from Day One** – can instantly pefrom transactions.  
- **Transparent On-Chain Settlement** – every transaction is auditable on the blockchain.    

---

## ⚙️ How Our Project Works

1. **Connect Wallet**  
   User connects their Crossmart wallet to Wiser’s platform.  
2. **KYC & DID Creation**  
   User have to complete KYC and generate a Decentralized Identifier (DID) on chain.  
3. **Request Debit Card**  
   User requests a virtual debit card generated from their wallet address, issued via the Marqeta sandbox API. 
4. **Initiate Payment at Merchant**
   User makes a purchase using the debit card at a regular merchant.
5. **Pathfinding & Conversion**
   Wiser triggers XRPL’s pathfinding algorithm to find the most efficient route to convert the selected token (FT) into USD.
6. **Just-in-Time Funding**
The converted USD amount is sent directly to Marqeta, funding the card just-in-time to complete the payment.

---

## 🛠 Tech Stack

### 🌐 Frontend
- **Next.js** – User interface and onboarding flows  
- **Tailwind CSS** – Responsive and modern UI components  
- **Crossmart Wallet** – XRPL wallet integration

### 🔗 Blockchain & Crypto
- **XRP Ledger (XRPL)** – Wallet integration, and real-time pathfinding for crypto-to-fiat conversion  
- **XRPL Pathfinding** – identifies the most cost-effective route for payments converting to USD 
- **Decentralized Identifiers (DIDs)** – On-chain identity tied to user identity

### 💳 Payments & Card Issuance
- **Marqeta Sandbox API** – Issues virtual debit cards, manages card lifecycle and payment flow  
- **Visa (PCI Tokenization)** – Secure card token input, ensuring PCI-compliant card detail handling

### 🖥 Backend
- **Node.js / Express** – RESTful API and server logic   
- **Web3 Libraries** – Wallet signing, transaction processing, XRPL operations

---

