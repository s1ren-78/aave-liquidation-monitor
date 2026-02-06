# AAVE V3 Liquidation Monitor

A real-time web application for monitoring AAVE V3 lending positions and liquidation risks on Ethereum Mainnet.

## Features

- **Multi-address monitoring**: Track multiple wallet addresses simultaneously
- **Real-time health factor**: View position health with color-coded risk indicators
- **ETH price tracking**: Live ETH/USD price from Chainlink oracles
- **Liquidation risk visualization**: Interactive chart showing cumulative liquidation risk at different ETH prices
- **Transaction history**: View recent transactions for monitored addresses
- **Persistent storage**: Addresses are saved locally and persist across sessions

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Blockchain**: Ethers.js v6
- **Data Sources**:
  - Aave V3 Pool Contract
  - Chainlink ETH/USD Price Feed
  - Etherscan API

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
cd 仓位监控
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.local.example .env.local
```

4. Configure your API keys in `.env.local`:
```
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key_here
NEXT_PUBLIC_ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_ALCHEMY_API_KEY` | Yes | Alchemy API key for Ethereum RPC |
| `NEXT_PUBLIC_ETHERSCAN_API_KEY` | No | Etherscan API key for transaction history |

### Contract Addresses (Ethereum Mainnet)

- **Aave V3 Pool**: `0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2`
- **Chainlink ETH/USD**: `0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419`

## Usage

1. **Add addresses**: Enter Ethereum addresses in the input field to start monitoring
2. **View positions**: The table shows health factor, collateral, debt, and estimated liquidation price
3. **Check risk**: The chart visualizes cumulative liquidation value at different ETH prices
4. **View transactions**: Click on an address to see its recent transactions
5. **External links**: Click Etherscan or DeBank icons to view detailed information

## Health Factor Color Coding

- **Green (>2.0)**: Safe position
- **Yellow (1.5-2.0)**: Monitor closely
- **Orange (1.1-1.5)**: High risk
- **Red (<1.1)**: Imminent liquidation risk

## Data Refresh

Data automatically refreshes every 30 seconds. You can also manually refresh using the refresh button in the header.

## License

MIT
