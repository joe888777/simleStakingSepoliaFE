
# Demo
https://www.loom.com/share/8355fd4a30c84aa8a3dcda6d0a0f92ce?sid=36e9c67d-f519-4216-822e-dd4ba204b40c

# Web3 Wallet & SimpleStaking dApp

A decentralized application (dApp) for staking, depositing, and swapping tokens using Thirdweb wallet integration and smart contracts on Sepolia testnet.

## Features

- 🔐 **Wallet Connection**: Connect Web3 wallets using Thirdweb SDK
- 💰 **Token Staking**: Stake AMGT tokens to earn rewards
- 🏦 **Liquidity Deposit**: Deposit AMGT tokens for swap liquidity
- 🔄 **Token Swap**: Swap USDCT ↔ AMGT at 1:1 ratio
- 📊 **Real-time Balances**: View staked, deposited, and total balances
- 🌐 **Sepolia Testnet**: Fully tested on Ethereum Sepolia testnet

## Tech Stack

- **Frontend**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Wallet Integration**: Thirdweb SDK 4.9.4
- **Blockchain Library**: ethers.js 5.7.2
- **Network**: Sepolia Testnet

## Smart Contracts

### Contract Addresses (Sepolia)

| Contract | Address |
|----------|---------|
| USDCT Token | `0x43501626f8B843CdA89825f4d6dB764c8c917b25` |
| AMGT Token | `0x680fA406987E41dae6eDFc7CFeA091F990492242` |
| SimpleStaking | `0xF20e3C9749F1d4631ba2E1e016d6827322984957` |

## Installation

### Prerequisites

- Node.js 16+ and npm/yarn
- MetaMask or any Web3 wallet
- Sepolia testnet ETH ([Get from faucet](https://sepoliafaucet.com/))

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd test
   ```

2. **Install dependencies**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Thirdweb client ID:
   ```env
   VITE_THIRDWEB_CLIENT_ID=your-thirdweb-client-id
   ```

   Get your client ID from [Thirdweb Dashboard](https://thirdweb.com/dashboard)

4. **Start development server**
   ```bash
   yarn dev
   # or
   npm run dev
   ```

   App will be available at `http://localhost:3000`

## Usage

### 1. Connect Wallet

Click the "Connect Wallet" button and select your preferred wallet (MetaMask, WalletConnect, etc.)

### 2. Switch to Sepolia Network

Ensure your wallet is connected to the Sepolia testnet

### 3. Get Test Tokens

- Get Sepolia ETH from a faucet
- Mint or acquire AMGT and USDCT test tokens

### 4. Staking Operations

#### **Stake Tokens**
1. Enter the amount of AMGT to stake
2. Click "Stake" button
3. Sign the permit in your wallet (1 signature using EIP-2612 permit)

#### **Deposit for Liquidity**
1. Enter the amount of AMGT to deposit
2. Click "Deposit" button
3. Approve the transaction in your wallet (2 transactions: approve + deposit)

#### **Withdraw Staked Tokens**
1. Enter the amount to withdraw
2. Click "Withdraw" button
3. Approve the transaction in your wallet (1 transaction)

#### **Swap Tokens**
1. Enter the amount of USDCT to swap for AMGT
2. Click "Swap" button
3. Sign the permit in your wallet (1 signature using EIP-2612 permit)

## Project Structure

```
test/
├── src/
│   ├── contract/
│   │   ├── erc20_ABI.json          # ERC20 token ABI
│   │   ├── SimpleStaking_ABI.json  # Staking contract ABI
│   │   ├── erc20.js                # ERC20 contract functions
│   │   └── SimpleStaking.js        # Staking contract functions
│   ├── main.jsx                    # App entry point
│   ├── WalletPage.jsx              # Main UI component
│   └── setting.js                  # Contract addresses
├── .env                            # Environment variables
├── .env.example                    # Environment template
├── package.json                    # Dependencies
├── vite.config.js                  # Vite configuration
├── WALLET_INTEGRATION.md           # Detailed integration docs
└── README.md                       # This file
```

## Available Scripts

```bash
# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

## How It Works

### SimpleStaking Contract

The SimpleStaking contract provides two main functionalities:

1. **Staking Pool**: Users stake AMGT tokens
   - Tracks individual staked balances
   - Tracks total staked amount
   - Allows withdrawal of staked tokens

2. **Liquidity Pool**: Users deposit AMGT for swap operations
   - Provides liquidity for USDCT ↔ AMGT swaps
   - 1:1 swap ratio
   - Tracks deposited balances

### Transaction Flow

Write operations use two different patterns:

1. **Permit-based (Stake, Swap)**: Single signature using EIP-2612 permit
   - User signs a permit message (gasless)
   - Transaction combines permit + action in one call

2. **Approve-based (Deposit, Withdraw)**: Standard two-step flow
   - User approves the staking contract to spend tokens
   - User executes the main transaction

**Example: Staking Flow (with Permit)**
```
User → Sign Permit → SimpleStaking Contract (stakeWithPermit)
```

**Example: Deposit Flow (with Approve)**
```
User → Approve AMGT → SimpleStaking Contract
User → Deposit AMGT → SimpleStaking Contract
```

### Read Operations

The app fetches real-time data:
- Your staked balance
- Your deposited balance
- Total staked in the contract
- Total deposited in the contract

## API Reference

### ERC20 Functions

#### `approve(tokenAddress, spenderAddress, amount, signer)`
Approves a spender to spend tokens.

#### `getPermitSignature(tokenAddress, spenderAddress, amount, signer, deadline)`
Generates EIP-2612 permit signature for gasless approval.

### SimpleStaking Functions

#### Write Functions (Require Wallet Signature)
- `stakeWithPermit(contractAddress, tokenAddress, amount, signer)` - Stake AMGT with permit (1 signature)
- `deposit(contractAddress, amount, signer)` - Deposit AMGT for liquidity (requires approve first)
- `withdraw(contractAddress, amount, signer)` - Withdraw staked AMGT
- `swapWithPermit(contractAddress, tokenAddress, amount, signer)` - Swap USDCT for AMGT with permit (1 signature)

#### Read Functions (No Signature Required)
- `getStakedBalance(contractAddress, userAddress, provider)` - Get user's staked balance
- `getDepositedBalance(contractAddress, userAddress, provider)` - Get user's deposited balance
- `getTotalStaked(contractAddress, provider)` - Get total staked amount
- `getTotalDeposited(contractAddress, provider)` - Get total deposited amount
- `getTokenA(contractAddress, provider)` - Get USDCT address
- `getTokenB(contractAddress, provider)` - Get AMGT address
- `getTokenBalance(contractAddress, tokenAddress, provider)` - Get token balance

## Error Handling

Common errors and solutions:

| Error | Solution |
|-------|----------|
| "Insufficient allowance" | Approve more tokens before transaction |
| "Insufficient balance" | Get more tokens from faucet or check balance |
| "User rejected transaction" | Try again and approve in wallet |
| "Wrong network" | Switch to Sepolia testnet in wallet |
| "Insufficient funds for gas" | Get more Sepolia ETH from faucet |

## Security

⚠️ **Important Security Notes:**

- This is a **testnet application** - Do not use on mainnet without proper audits
- Never share your private keys or seed phrases
- Always verify contract addresses before transactions
- Start with small amounts to test functionality
- Approve only the amount you intend to use

## Troubleshooting

### Wallet won't connect
- Ensure MetaMask or wallet extension is installed
- Check that you're on Sepolia network
- Refresh the page and try again

### Transactions failing
- Check you have enough Sepolia ETH for gas
- Verify you have enough token balance
- Ensure you approved sufficient amount

### Balances not updating
- Click "Refresh Staking Data" button
- Check wallet connection
- Verify transactions completed on [Sepolia Etherscan](https://sepolia.etherscan.io/)

## Development

### Adding New Features

1. Add contract functions in `src/contract/`
2. Import and use in `src/WalletPage.jsx`
3. Update UI as needed
4. Test thoroughly on Sepolia

### Updating Contract Addresses

Edit `src/setting.js`:
```javascript
export const USDCTContractAddress = "0x...";
export const AMGTContractAddress = "0x...";
export const SimpleStakeContractAddress = "0x...";
```

## Resources

- [Thirdweb Documentation](https://portal.thirdweb.com/)
- [Ethers.js Documentation](https://docs.ethers.org/v5/)
- [Sepolia Testnet Explorer](https://sepolia.etherscan.io/)
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Detailed Integration Guide](./WALLET_INTEGRATION.md)

## License

ISC

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For questions or issues, please open an issue in the repository.

---

**Built with ❤️ using Thirdweb, React, and ethers.js**
