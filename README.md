# WhereIsMyLunch - XRPL DID KYC System

![Wiser Logo](public/wiserlogo.png)

## Overview

**WhereIsMyLunch** is a comprehensive Know Your Customer (KYC) system built on the XRP Ledger (XRPL) that integrates Decentralized Identity (DID) management with secure identity verification. The application provides a modern, user-friendly interface for conducting KYC processes while leveraging blockchain technology for identity management.

## Features

### 🔐 DID Management System
- **Fixed Account DID**: Deterministic wallet creation for consistent identity management
- **XRPL Integration**: Direct integration with XRP Ledger testnet
- **Secure Wallet Creation**: Cryptographically secure wallet generation from fixed credentials
- **DID Resolution**: Complete DID document creation and resolution

### 📋 Comprehensive KYC Process
- **Multi-step Form**: 6-step progressive KYC form with validation
- **Document Upload**: Support for identity documents, address proofs, and financial documents
- **Real-time Validation**: Client-side and server-side validation
- **Progress Tracking**: Visual progress indicator throughout the process

### 💳 Financial Information Capture
- **Debit/Credit Card Integration**: Secure card information collection
- **Income Verification**: Employment status and income range validation
- **Source of Funds**: Compliance with anti-money laundering requirements
- **Document Verification**: Payslip and financial document upload

### 🌐 Modern Web Interface
- **Next.js Framework**: Server-side rendering and optimal performance
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive UI**: Framer Motion animations and modern UX patterns
- **Real-time Updates**: Live form validation and progress updates

## Technology Stack

### Frontend
- **Next.js 15.3.3** - React framework with SSR
- **React 19** - Modern React with hooks and context
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Animation library for smooth interactions
- **TypeScript Particles** - Interactive background effects

### Backend & Blockchain
- **XRPL (XRP Ledger)** - Blockchain integration for DID management
- **Crossmark SDK** - Wallet integration and transaction signing
- **Node.js** - Server-side JavaScript runtime
- **Crypto Module** - Cryptographic operations for wallet creation

## Project Structure

```
whereismylunch/
├── pages/                  # Next.js pages and routing
│   ├── index.js           # Landing page
│   ├── kyc-form.js        # Main KYC form (1493 lines)
│   ├── landing.js         # Marketing landing page
│   ├── card.js            # Card information page
│   └── api/               # API routes
├── src/                   # Core application logic
│   ├── index.js           # Main DID system implementation
│   ├── kyc-did-system.js  # Complete KYC-DID integration
│   ├── kyc-demo.js        # Demo and testing utilities
│   └── demo.js            # Basic demo functionality
├── components/            # Reusable React components
│   ├── header.js          # Application header
│   ├── connectwallet.js   # Wallet connection component
│   └── ui/                # UI component library
├── public/                # Static assets
│   └── wiserlogo.png      # Company logo
└── styles/                # CSS and styling files
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- XRPL Testnet access

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd whereismylunch
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Environment Setup

The application connects to XRPL Testnet by default. No additional environment variables are required for basic functionality, as the system uses fixed credentials for deterministic wallet creation.

## Usage

### KYC Process Flow

1. **Personal Information** - Basic identity details
2. **Identity Documents** - Government ID upload and verification
3. **Address Information** - Residential address with proof
4. **Financial Information** - Income and employment verification
5. **Payment Information** - Debit/credit card details
6. **Consents & Agreements** - Legal compliance and data processing consent

### DID Management

The application automatically:
- Creates a deterministic XRPL wallet
- Generates a unique DID (Decentralized Identifier)
- Publishes DID documents to the XRPL
- Manages identity verification status

## API Routes

- `/api/kyc` - KYC data submission and processing
- `/api/did` - DID management and resolution
- `/api/wallet` - Wallet operations and funding

## Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

### Key Components

- **FixedAccountDID**: Core DID management system
- **KYCForm**: Multi-step form with validation
- **Header**: Navigation and wallet connection
- **ConnectWallet**: XRPL wallet integration

## Security Features

- Deterministic wallet creation for consistency
- Secure document upload handling
- Client-side form validation
- Server-side data sanitization
- XRPL testnet integration for safe testing

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For support and questions, please contact the development team.

---

