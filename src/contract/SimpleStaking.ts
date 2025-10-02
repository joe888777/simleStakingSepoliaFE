import { ethers } from 'ethers';
import simpleStakingABI from './SimpleStaking_ABI.json';
import { getPermitSignature } from './erc20';

// Extract the ABI array
const abi = simpleStakingABI.abi;

/**
 * Deposit tokenB into the contract to provide swap liquidity
 * @param contractAddress - SimpleStaking contract address
 * @param amount - Amount to deposit (in wei)
 * @param signer - Ethers signer instance
 * @returns Transaction receipt
 */
export async function deposit(
  contractAddress: string,
  amount: ethers.BigNumber,
  signer: ethers.Signer
): Promise<ethers.ContractReceipt> {
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const tx = await contract.deposit(amount);
  return await tx.wait();
}

/**
 * Stake tokenB into the contract
 * @param contractAddress - SimpleStaking contract address
 * @param amount - Amount to stake (in wei)
 * @param signer - Ethers signer instance
 * @returns Transaction receipt
 */
export async function stake(
  contractAddress: string,
  amount: ethers.BigNumber,
  signer: ethers.Signer
): Promise<ethers.ContractReceipt> {
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const tx = await contract.stake(amount);
  return await tx.wait();
}

/**
 * Withdraw staked tokenB
 * @param contractAddress - SimpleStaking contract address
 * @param amount - Amount to withdraw (in wei)
 * @param signer - Ethers signer instance
 * @returns Transaction receipt
 */
export async function withdraw(
  contractAddress: string,
  amount: ethers.BigNumber,
  signer: ethers.Signer
): Promise<ethers.ContractReceipt> {
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const tx = await contract.withdraw(amount);
  return await tx.wait();
}

/**
 * Swap tokenA for tokenB (1:1 ratio)
 * @param contractAddress - SimpleStaking contract address
 * @param amount - Amount to swap (in wei)
 * @param signer - Ethers signer instance
 * @returns Transaction receipt
 */
export async function swap(
  contractAddress: string,
  amount: ethers.BigNumber,
  signer: ethers.Signer
): Promise<ethers.ContractReceipt> {
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const tx = await contract.swap(amount);
  return await tx.wait();
}

/**
 * Get tokenA address
 * @param contractAddress - SimpleStaking contract address
 * @param provider - Ethers provider instance
 * @returns TokenA address
 */
export async function getTokenA(
  contractAddress: string,
  provider: ethers.providers.Provider
): Promise<string> {
  const contract = new ethers.Contract(contractAddress, abi, provider);
  return await contract.tokenA();
}

/**
 * Get tokenB address
 * @param contractAddress - SimpleStaking contract address
 * @param provider - Ethers provider instance
 * @returns TokenB address
 */
export async function getTokenB(
  contractAddress: string,
  provider: ethers.providers.Provider
): Promise<string> {
  const contract = new ethers.Contract(contractAddress, abi, provider);
  return await contract.tokenB();
}

/**
 * Get deposited balance of a user
 * @param contractAddress - SimpleStaking contract address
 * @param userAddress - User address to check
 * @param provider - Ethers provider instance
 * @returns Deposited balance
 */
export async function getDepositedBalance(
  contractAddress: string,
  userAddress: string,
  provider: ethers.providers.Provider
): Promise<ethers.BigNumber> {
  const contract = new ethers.Contract(contractAddress, abi, provider);
  return await contract.depositedBalance(userAddress);
}

/**
 * Get staked balance of a user
 * @param contractAddress - SimpleStaking contract address
 * @param userAddress - User address to check
 * @param provider - Ethers provider instance
 * @returns Staked balance
 */
export async function getStakedBalance(
  contractAddress: string,
  userAddress: string,
  provider: ethers.providers.Provider
): Promise<ethers.BigNumber> {
  const contract = new ethers.Contract(contractAddress, abi, provider);
  return await contract.stakedBalance(userAddress);
}

/**
 * Get token balance of the contract
 * @param contractAddress - SimpleStaking contract address
 * @param tokenAddress - Token address to check
 * @param provider - Ethers provider instance
 * @returns Token balance
 */
export async function getTokenBalance(
  contractAddress: string,
  tokenAddress: string,
  provider: ethers.providers.Provider
): Promise<ethers.BigNumber> {
  const contract = new ethers.Contract(contractAddress, abi, provider);
  return await contract.getTokenBalance(tokenAddress);
}

/**
 * Get total staked amount
 * @param contractAddress - SimpleStaking contract address
 * @param provider - Ethers provider instance
 * @returns Total staked amount
 */
export async function getTotalStaked(
  contractAddress: string,
  provider: ethers.providers.Provider
): Promise<ethers.BigNumber> {
  const contract = new ethers.Contract(contractAddress, abi, provider);
  return await contract.totalStaked();
}

/**
 * Get total deposited amount
 * @param contractAddress - SimpleStaking contract address
 * @param provider - Ethers provider instance
 * @returns Total deposited amount
 */
export async function getTotalDeposited(
  contractAddress: string,
  provider: ethers.providers.Provider
): Promise<ethers.BigNumber> {
  const contract = new ethers.Contract(contractAddress, abi, provider);
  return await contract.totalDeposited();
}

/**
 * Stake with permit (single signature for approve + stake)
 * @param contractAddress - SimpleStaking contract address
 * @param tokenAddress - Token address to stake
 * @param amount - Amount to stake (in wei)
 * @param signer - Ethers signer instance
 * @returns Transaction receipt
 */
export async function stakeWithPermit(
  contractAddress: string,
  tokenAddress: string,
  amount: ethers.BigNumber,
  signer: ethers.Signer
): Promise<ethers.ContractReceipt> {
  const contract = new ethers.Contract(contractAddress, abi, signer);

  // Get permit signature (no transaction, just signature)
  const permitData = await getPermitSignature(tokenAddress, contractAddress, amount, signer);

  // Call stakeWithPermit with signature parameters
  const tx = await contract.stakeWithPermit(
    amount,
    permitData.deadline,
    permitData.v,
    permitData.r,
    permitData.s
  );
  return await tx.wait();
}

/**
 * Deposit with approve (2 transactions - no depositWithPermit in contract)
 * @param contractAddress - SimpleStaking contract address
 * @param tokenAddress - Token address to deposit
 * @param amount - Amount to deposit (in wei)
 * @param signer - Ethers signer instance
 * @param approveFunc - The approve function from erc20.ts
 * @returns Transaction receipt
 */
export async function depositWithApprove(
  contractAddress: string,
  tokenAddress: string,
  amount: ethers.BigNumber,
  signer: ethers.Signer,
  approveFunc: (tokenAddress: string, spenderAddress: string, amount: ethers.BigNumber, signer: ethers.Signer) => Promise<ethers.ContractReceipt>
): Promise<ethers.ContractReceipt> {
  // First approve
  await approveFunc(tokenAddress, contractAddress, amount, signer);

  // Then deposit
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const tx = await contract.deposit(amount);
  return await tx.wait();
}

/**
 * Swap with permit (single signature for approve + swap)
 * @param contractAddress - SimpleStaking contract address
 * @param tokenAddress - Token address to swap
 * @param amount - Amount to swap (in wei)
 * @param signer - Ethers signer instance
 * @returns Transaction receipt
 */
export async function swapWithPermit(
  contractAddress: string,
  tokenAddress: string,
  amount: ethers.BigNumber,
  signer: ethers.Signer
): Promise<ethers.ContractReceipt> {
  const contract = new ethers.Contract(contractAddress, abi, signer);

  // Get permit signature (no transaction, just signature)
  const permitData = await getPermitSignature(tokenAddress, contractAddress, amount, signer);

  // Call swapWithPermit with signature parameters
  const tx = await contract.swapWithPermit(
    amount,
    permitData.deadline,
    permitData.v,
    permitData.r,
    permitData.s
  );
  return await tx.wait();
}
