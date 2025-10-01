# Wallet Integration & Smart Contract Access Documentation

## Overview

This project uses **Thirdweb SDK** for wallet connection and **ethers.js v5** for smart contract interactions on the Sepolia testnet.

## Table of Contents

1. [Wallet Adapter Setup](#wallet-adapter-setup)
2. [Smart Contract Configuration](#smart-contract-configuration)
3. [Contract Functions](#contract-functions)
4. [Usage Examples](#usage-examples)

---

## Wallet Adapter Setup

### Dependencies

```json
{
  "@thirdweb-dev/react": "^4.9.4",
  "@thirdweb-dev/sdk": "^4.0.99",
  "ethers": "^5.7.2"
}
```

### ThirdwebProvider Configuration

The app is wrapped with `ThirdwebProvider` to enable wallet connectivity:

```jsx
import { ThirdwebProvider } from '@thirdweb-dev/react';

function WalletPage() {
  return (
    <ThirdwebProvider
      activeChain="sepolia"
      clientId={import.meta.env.VITE_THIRDWEB_CLIENT_ID}
    >
      <WalletInteraction />
    </ThirdwebProvider>
  );
}
```

**Environment Variables:**
- `VITE_THIRDWEB_CLIENT_ID`: Your Thirdweb client ID from the dashboard

### Wallet Connection

```jsx
import { ConnectWallet, useAddress, useSDK } from '@thirdweb-dev/react';

function WalletInteraction() {
  const address = useAddress(); // Get connected wallet address
  const sdk = useSDK(); // Get Thirdweb SDK instance

  return (
    <div>
      <ConnectWallet />
      {address && <p>Connected: {address}</p>}
    </div>
  );
}
```

### Getting Signer and Provider

```jsx
// Get signer for write operations
const signer = await sdk.getSigner();

// Get provider for read operations
const provider = await sdk.getProvider();
```

---

## Smart Contract Configuration

### Contract Addresses (Sepolia Testnet)

Located in `src/setting.js`:

```javascript
export const USDCTContractAddress = "0x43501626f8B843CdA89825f4d6dB764c8c917b25";
export const AMGTContractAddress = "0x680fA406987E41dae6eDFc7CFeA091F990492242";
export const SimpleStakeContractAddress = "0x184E36AF6Cf168bD6D43770053d6737611E83E97";
```

### Contract ABIs

- **ERC20 ABI**: `src/contract/erc20_ABI.json`
- **SimpleStaking ABI**: `src/contract/SimpleStaking_ABI.json`

---

## Contract Functions

### ERC20 Functions

Located in `src/contract/erc20.js`:

#### `approve(tokenAddress, spenderAddress, amount, signer)`

Approves a spender to spend tokens on behalf of the owner.

**Parameters:**
- `tokenAddress` (string): ERC20 token contract address
- `spenderAddress` (string): Address to approve
- `amount` (string): Amount to approve (in wei)
- `signer` (object): Ethers signer instance

**Returns:** Promise<TransactionReceipt>

**Example:**
```javascript
import { approve } from './contract/erc20';

const amountWei = ethers.utils.parseEther("100");
await approve(AMGTContractAddress, SimpleStakeContractAddress, amountWei, signer);
```

---

### SimpleStaking Functions

Located in `src/contract/SimpleStaking.js`:

#### Write Functions (Require Signer)

##### `stake(contractAddress, amount, signer)`

Stakes tokenB (AMGT) into the contract.

**Parameters:**
- `contractAddress` (string): SimpleStaking contract address
- `amount` (string): Amount to stake (in wei)
- `signer` (object): Ethers signer instance

**Returns:** Promise<TransactionReceipt>

**Example:**
```javascript
import { stake } from './contract/SimpleStaking';

const amountWei = ethers.utils.parseEther("50");
await stake(SimpleStakeContractAddress, amountWei, signer);
```

##### `deposit(contractAddress, amount, signer)`

Deposits tokenB (AMGT) to provide swap liquidity.

**Parameters:**
- `contractAddress` (string): SimpleStaking contract address
- `amount` (string): Amount to deposit (in wei)
- `signer` (object): Ethers signer instance

**Returns:** Promise<TransactionReceipt>

##### `withdraw(contractAddress, amount, signer)`

Withdraws staked tokenB (AMGT).

**Parameters:**
- `contractAddress` (string): SimpleStaking contract address
- `amount` (string): Amount to withdraw (in wei)
- `signer` (object): Ethers signer instance

**Returns:** Promise<TransactionReceipt>

##### `swap(contractAddress, amount, signer)`

Swaps tokenA (USDCT) for tokenB (AMGT) at 1:1 ratio.

**Parameters:**
- `contractAddress` (string): SimpleStaking contract address
- `amount` (string): Amount to swap (in wei)
- `signer` (object): Ethers signer instance

**Returns:** Promise<TransactionReceipt>

#### Read Functions (Require Provider)

##### `getStakedBalance(contractAddress, userAddress, provider)`

Gets the staked balance of a user.

**Returns:** Promise<BigNumber>

##### `getDepositedBalance(contractAddress, userAddress, provider)`

Gets the deposited balance of a user.

**Returns:** Promise<BigNumber>

##### `getTotalStaked(contractAddress, provider)`

Gets the total staked amount in the contract.

**Returns:** Promise<BigNumber>

##### `getTotalDeposited(contractAddress, provider)`

Gets the total deposited amount in the contract.

**Returns:** Promise<BigNumber>

##### `getTokenA(contractAddress, provider)`

Gets tokenA (USDCT) address.

**Returns:** Promise<string>

##### `getTokenB(contractAddress, provider)`

Gets tokenB (AMGT) address.

**Returns:** Promise<string>

##### `getTokenBalance(contractAddress, tokenAddress, provider)`

Gets the token balance of the contract.

**Returns:** Promise<BigNumber>

---

## Usage Examples

### Complete Stake Flow

```javascript
const handleStake = async () => {
  const signer = await sdk.getSigner();
  const amountWei = ethers.utils.parseEther("100");

  // Step 1: Approve AMGT token for staking contract
  await approve(AMGTContractAddress, SimpleStakeContractAddress, amountWei, signer);

  // Step 2: Stake tokens
  await stake(SimpleStakeContractAddress, amountWei, signer);

  console.log("Staking successful!");
};
```

### Complete Deposit Flow

```javascript
const handleDeposit = async () => {
  const signer = await sdk.getSigner();
  const amountWei = ethers.utils.parseEther("200");

  // Step 1: Approve AMGT token for staking contract
  await approve(AMGTContractAddress, SimpleStakeContractAddress, amountWei, signer);

  // Step 2: Deposit tokens
  await deposit(SimpleStakeContractAddress, amountWei, signer);

  console.log("Deposit successful!");
};
```

### Complete Swap Flow

```javascript
const handleSwap = async () => {
  const signer = await sdk.getSigner();
  const amountWei = ethers.utils.parseEther("50");

  // Step 1: Approve USDCT token for staking contract
  await approve(USDCTContractAddress, SimpleStakeContractAddress, amountWei, signer);

  // Step 2: Swap tokens
  await swap(SimpleStakeContractAddress, amountWei, signer);

  console.log("Swap successful!");
};
```

### Complete Withdraw Flow

```javascript
const handleWithdraw = async () => {
  const signer = await sdk.getSigner();
  const amountWei = ethers.utils.parseEther("75");

  // Step 1: Approve AMGT token for staking contract
  await approve(AMGTContractAddress, SimpleStakeContractAddress, amountWei, signer);

  // Step 2: Withdraw tokens
  await withdraw(SimpleStakeContractAddress, amountWei, signer);

  console.log("Withdrawal successful!");
};
```

### Fetching Balances

```javascript
const fetchBalances = async () => {
  const provider = await sdk.getProvider();

  // Get user balances
  const stakedBalance = await getStakedBalance(
    SimpleStakeContractAddress,
    address,
    provider
  );
  const depositedBalance = await getDepositedBalance(
    SimpleStakeContractAddress,
    address,
    provider
  );

  // Get total balances
  const totalStaked = await getTotalStaked(SimpleStakeContractAddress, provider);
  const totalDeposited = await getTotalDeposited(SimpleStakeContractAddress, provider);

  // Format to human-readable
  console.log("Staked:", ethers.utils.formatEther(stakedBalance));
  console.log("Deposited:", ethers.utils.formatEther(depositedBalance));
  console.log("Total Staked:", ethers.utils.formatEther(totalStaked));
  console.log("Total Deposited:", ethers.utils.formatEther(totalDeposited));
};
```

---

## Smart Contract Architecture

### SimpleStaking Contract

The SimpleStaking contract manages two main functionalities:

1. **Staking**: Users stake tokenB (AMGT) to earn rewards
2. **Liquidity Pool**: Users deposit tokenB (AMGT) to provide swap liquidity for tokenA (USDCT) ↔ tokenB (AMGT) swaps

**Key Functions:**
- `stake(uint256 amount)`: Stake AMGT tokens
- `deposit(uint256 amount)`: Deposit AMGT for swap liquidity
- `withdraw(uint256 amount)`: Withdraw staked AMGT
- `swap(uint256 amount)`: Swap USDCT for AMGT (1:1 ratio)

**State Variables:**
- `stakedBalance[address]`: User's staked balance
- `depositedBalance[address]`: User's deposited balance
- `totalStaked`: Total AMGT staked in the contract
- `totalDeposited`: Total AMGT deposited for swaps

---

## Error Handling

### Common Errors

1. **Insufficient Allowance**: User hasn't approved enough tokens
   - Solution: Call `approve()` before the transaction

2. **Insufficient Balance**: User doesn't have enough tokens
   - Solution: Check token balance before attempting transaction

3. **User Rejected Transaction**: User declined the transaction in their wallet
   - Solution: Prompt user to try again

4. **Network Mismatch**: User is on wrong network
   - Solution: Prompt user to switch to Sepolia testnet

### Example Error Handling

```javascript
const handleStake = async () => {
  try {
    const signer = await sdk.getSigner();
    const amountWei = ethers.utils.parseEther(stakeAmount);

    await approve(AMGTContractAddress, SimpleStakeContractAddress, amountWei, signer);
    await stake(SimpleStakeContractAddress, amountWei, signer);

    alert('Stake successful!');
  } catch (error) {
    if (error.code === 4001) {
      alert('Transaction rejected by user');
    } else if (error.message.includes('insufficient allowance')) {
      alert('Insufficient allowance. Please approve tokens first.');
    } else if (error.message.includes('insufficient balance')) {
      alert('Insufficient token balance');
    } else {
      console.error('Stake error:', error);
      alert('Stake failed: ' + error.message);
    }
  }
};
```

---

## Testing on Sepolia

1. **Get Sepolia ETH**: Use a faucet like https://sepoliafaucet.com/
2. **Get Test Tokens**: Mint AMGT and USDCT test tokens
3. **Connect Wallet**: Use MetaMask or any Web3 wallet
4. **Approve Tokens**: Before any transaction, approve the staking contract
5. **Execute Transactions**: Stake, deposit, swap, or withdraw

---

## Security Considerations

1. **Always approve exact amounts**: Don't approve unlimited allowances
2. **Verify contract addresses**: Double-check all addresses before transactions
3. **Use testnet first**: Test all functionality on Sepolia before mainnet
4. **Check balances**: Verify sufficient balance before transactions
5. **Monitor gas fees**: Ensure enough ETH for gas

---

## Additional Resources

- [Thirdweb Documentation](https://portal.thirdweb.com/)
- [Ethers.js v5 Documentation](https://docs.ethers.org/v5/)
- [Sepolia Testnet Explorer](https://sepolia.etherscan.io/)
