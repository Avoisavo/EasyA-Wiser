# 💳 Wiser – XRPL-Powered Payment Infrastructure

**Wiser** is a decentralized payment infrastructure built on the **XRP Ledger (XRPL)** that empowers users to spend their crypto assets like cash without losing custody. By combining **DIDs**, **on-chain KYC**, **XRPL pathfinding**, and the **Marqeta sandbox API**, users can generate a fully-functional **debit card** without needing to pre-fund it.

Wiser gives users seamless and cost-effective access to real-world payments using their crypto holdings.

![Logo](https://github.com/Avoisavo/whereismylunch/blob/main/public/Landing.png?raw=true)

1. Slides: https://www.canva.com/design/DAGpsHKbuIQ/I2XaqyN5kfj-0ufUsQTIEw/edit

2. Video: https://drive.google.com/file/d/1lYdo_smk_ybH-0V51dauQLmhRYSKjnAz/view?usp=sharing

---

## 💡 Inspiration

As crypto developers and users, our team has long struggled with the inefficiencies between crypto and fiat worlds. Today’s so-called “crypto debit cards” are often pseudo-bridges:

1. Users are forced to convert and preload fiat in advance.  
2. Users funds are held in custodial accounts.
3. Users are essentially just using a Web2 fintech product with a crypto skin.  

> “What if spending crypto could be as easy as swiping a debit card—without pre-funding while at the same time not giving up custody”  

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

![Logo](https://github.com/Avoisavo/whereismylunch/blob/main/public/Architecture.png?raw=true)



## Flow 1: Native XRP

1. **Connect Wallet**  
   - User connects Crossmart Wallet configured for XRPL.
2. **KYC & DID Creation**  
   - Complete KYC → mint on-chain Decentralized Identifier (DID).
3. **Request Debit Card**  
   - Issue virtual USD debit card via Marqeta sandbox API, linked to wallet address.
4. **Initiate Payment**  
   - User pays at merchant using the virtual card.
5. **Pathfinding & Conversion**  
   - Wiser calls XRPL pathfinding to convert user’s chosen FT → USD.
6. **Just-in-Time Funding**  
   - Send USD to Marqeta; payment settles immediately.

---

## Flow 2: EVM (Metamask + Alexar Bridge)

1. **Connect Wallet**  
   - User connects MetaMask (Ethereum network).
2. **KYC & DID Creation**  
   - Complete KYC → mint DID on-chain (EVM).
3. **Request Debit Card**  
   - Issue virtual USD debit card via Marqeta sandbox API, linked to wallet address.
4. **Initiate Payment**  
   - User attempts purchase at merchant.
5. **Bridge to XRPL-EVM**  
   - Use Alexar Bridge to convert chosen ETH (or ERC-20) → XRPL-EVM tokens.
6. **Bridge to XRPL Native**  
   - Use Alexar Bridge again to move XRPL-EVM tokens → native XRPL tokens.
7. **Pathfinding & Conversion**  
   - Wiser invokes XRPL pathfinding to convert native XRPL → USD.
8. **Just-in-Time Funding**  
   - Deliver USD to Marqeta for card funding and payment settlement.

---


## 🛠 Tech Stack

### 🌐 Frontend
- **Next.js** – User interface and onboarding flows  
- **Tailwind CSS** – Responsive and modern UI components  
- **Crossmart Wallet** – XRPL wallet integration  
- **MetaMask** – EVM wallet integration  

### 🔗 Blockchain & Crypto
- **XRP Ledger (XRPL)** – Wallet integration and real-time pathfinding for crypto-to-fiat conversion  
- **XRPL Pathfinding** – Identifies the most cost-effective route for payments converting to USD (https://testnet.xrpl.org/transactions/3E7312DCEC27BF5525F64C6E7A43B5BD4570C185C8D36EAAB6608F8915DD9E9C)
- **Decentralized Identifiers (DIDs)** – On-chain identity tied to user identity (https://testnet.xrpl.org/transactions/29C0C4A618BBCE248DCB579262F0B65671C3B667C9EB73D1D5D33AFABC53DD0D)
- **Axelar Bridge** – Cross-chain bridge for converting ETH/ERC-20 to XRPL-EVM tokens and back  
- **XRPL EVM Sidechain** – EVM-compatible layer on the XRP Ledger for seamless smart-contract interoperability (https://evm-sidechain.xrpl.org/tx/0x2dabfb6012e1e346e999da921e5cb6c895ee4a98f30ff045d114f5cf52de1de2)

### 💳 Payments & Card Issuance
- **Marqeta Sandbox API** – Issues virtual debit cards, manages card lifecycle and payment flow  
- **Visa (PCI Tokenization)** – Secure card token input, ensuring PCI-compliant card detail handling

### 🖥 Backend
- **Node.js / Express** – RESTful API and server logic   
- **Web3 Libraries** – Wallet signing, transaction processing, XRPL operations


---

## 📁 Important Code Directory Structure

```
.
├── pages
│   ├── create.js              # “Create Card” UI
│   ├── kyc-form.js            # DID submission form on XRPL
│   ├── transaction.js         # Simulate Visa transactions 
│   └── api
│       ├── createCard.js      # POST handler – calls Marqeta API to create a card
│       └── transact.js        # POST handler – simulate Visa transaction
│
├── components
│   └── ConnectWallet.jsx      # Crossmart & MetaMask integrations
│
└── scripts.js                 # XRPL pathfinding helper

```



## How We Use XRP

- **Payment Network** – The payment is run on the XRPL Testnet.  
- **Decentralized Identifier (DID)** – Used for KYC/AML when users submit their details.  
- **XRPL PathFinding** – Used to convert crypto to the needed currency or Web2 settlement.  
- **XRPL EVM Sidechain** – Used when users connect with MetaMask then the payment is run on the XRPL EVM Sidechain. 
- **Axelar Bridge** – Used for cross-chain bridging between EVM and XRPL. 

---

## Future Implementations

- **Web3 Wise Card** – In the future, we want to evolve Wiser into a fully decentralized “Web3 Wise Card” experience, with on-chain settlement, programmable card logic, and seamless smart-contract integrations.  
- **Card-to-Wallet Reverse Flow** – Enable users to reverse the process: top up their blockchain wallets directly from their own card, converting fiat back into crypto on-chain just-in-time.  


