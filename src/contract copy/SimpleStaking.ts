import { ethers } from 'ethers';
import simpleStakingABI from './SimpleStaking_ABI.json';
import { getPermitSignature } from './erc20';

// Extract the ABI array
const abi = simpleStakingABI.abi;

/**
 * Deposit tokenB into the contract to provide swap liquidity
 * @param {string} contractAddress - SimpleStaking contract address
 * @param {string} amount - Amount to deposit (in wei)
 * @param {object} signer - Ethers signer instance
 * @returns {Promise<object>} Transaction receipt
 */
export async function deposit(contractAddress: string, amount: ethers.BigNumber, signer: ethers.Signer | ethers.providers.Provider | undefined) {
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const tx = await contract.deposit(amount);
  return await tx.wait();
}

/**
 * Stake tokenB into the contract
 * @param {string} contractAddress - SimpleStaking contract address
 * @param {string} amount - Amount to stake (in wei)
 * @param {object} signer - Ethers signer instance
 * @returns {Promise<object>} Transaction receipt
 */
export async function stake(contractAddress: string, amount: any, signer: ethers.Signer | ethers.providers.Provider | undefined) {
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const tx = await contract.stake(amount);
  return await tx.wait();
}

/**
 * Withdraw staked tokenB
 * @param {string} contractAddress - SimpleStaking contract address
 * @param {string} amount - Amount to withdraw (in wei)
 * @param {object} signer - Ethers signer instance
 * @returns {Promise<object>} Transaction receipt
 */
export async function withdraw(contractAddress: string, amount: ethers.BigNumber, signer: ethers.Signer | ethers.providers.Provider | undefined) {
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const tx = await contract.withdraw(amount);
  return await tx.wait();
}

/**
 * Swap tokenA for tokenB (1:1 ratio)
 * @param {string} contractAddress - SimpleStaking contract address
 * @param {string} amount - Amount to swap (in wei)
 * @param {object} signer - Ethers signer instance
 * @returns {Promise<object>} Transaction receipt
 */
export async function swap(contractAddress: string, amount: any, signer: ethers.Signer | ethers.providers.Provider | undefined) {
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const tx = await contract.swap(amount);
  return await tx.wait();
}

/**
 * Get tokenA address
 * @param {string} contractAddress - SimpleStaking contract address
 * @param {object} provider - Ethers provider instance
 * @returns {Promise<string>} TokenA address
 */
export async function getTokenA(contractAddress: string, provider: ethers.Signer | ethers.providers.Provider | undefined) {
  const contract = new ethers.Contract(contractAddress, abi, provider);
  return await contract.tokenA();
}

/**
 * Get tokenB address
 * @param {string} contractAddress - SimpleStaking contract address
 * @param {object} provider - Ethers provider instance
 * @returns {Promise<string>} TokenB address
 */
export async function getTokenB(contractAddress: string, provider: ethers.Signer | ethers.providers.Provider | undefined) {
  const contract = new ethers.Contract(contractAddress, abi, provider);
  return await contract.tokenB();
}

/**
 * Get deposited balance of a user
 * @param {string} contractAddress - SimpleStaking contract address
 * @param {string} userAddress - User address to check
 * @param {object} provider - Ethers provider instance
 * @returns {Promise<string>} Deposited balance
 */
export async function getDepositedBalance(contractAddress: string, userAddress: string, provider: ethers.Signer | ethers.providers.Provider | undefined) {
  const contract = new ethers.Contract(contractAddress, abi, provider);
  return await contract.depositedBalance(userAddress);
}

/**
 * Get staked balance of a user
 * @param {string} contractAddress - SimpleStaking contract address
 * @param {string} userAddress - User address to check
 * @param {object} provider - Ethers provider instance
 * @returns {Promise<string>} Staked balance
 */
export async function getStakedBalance(contractAddress: string, userAddress: string, provider: ethers.Signer | ethers.providers.Provider | undefined) {
  const contract = new ethers.Contract(contractAddress, abi, provider);
  return await contract.stakedBalance(userAddress);
}

/**
 * Get token balance of the contract
 * @param {string} contractAddress - SimpleStaking contract address
 * @param {string} tokenAddress - Token address to check
 * @param {object} provider - Ethers provider instance
 * @returns {Promise<string>} Token balance
 */
export async function getTokenBalance(contractAddress: string, tokenAddress: any, provider: ethers.Signer | ethers.providers.Provider | undefined) {
  const contract = new ethers.Contract(contractAddress, abi, provider);
  return await contract.getTokenBalance(tokenAddress);
}

/**
 * Get total staked amount
 * @param {string} contractAddress - SimpleStaking contract address
 * @param {object} provider - Ethers provider instance
 * @returns {Promise<string>} Total staked amount
 */
export async function getTotalStaked(contractAddress: string, provider: ethers.Signer | ethers.providers.Provider | undefined) {
  const contract = new ethers.Contract(contractAddress, abi, provider);
  return await contract.totalStaked();
}

/**
 * Get total deposited amount
 * @param {string} contractAddress - SimpleStaking contract address
 * @param {object} provider - Ethers provider instance
 * @returns {Promise<string>} Total deposited amount
 */
export async function getTotalDeposited(contractAddress: string, provider: ethers.Signer | ethers.providers.Provider | undefined) {
  const contract = new ethers.Contract(contractAddress, abi, provider);
  return await contract.totalDeposited();
}

/**
 * Stake with permit (single signature for approve + stake)
 * @param {string} contractAddress - SimpleStaking contract address
 * @param {string} tokenAddress - Token address to stake
 * @param {string} amount - Amount to stake (in wei)
 * @param {object} signer - Ethers signer instance
 * @returns {Promise<object>} Transaction receipt
 */
export async function stakeWithPermit(contractAddress: string, tokenAddress: string, amount: ethers.BigNumberish, signer: ethers.Signer | ethers.providers.Provider | undefined) {
  const contract = new ethers.Contract(contractAddress, abi, signer);

  // Ensure signer is of type ethers.Signer
  if (!signer || !('getAddress' in signer)) {
    throw new Error('A valid Signer is required for permit signature.');
  }
  const permitData = await getPermitSignature(tokenAddress, contractAddress, amount, signer as ethers.Signer);

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
 * @param {string} contractAddress - SimpleStaking contract address
 * @param {string} tokenAddress - Token address to deposit
 * @param {string} amount - Amount to deposit (in wei)
 * @param {object} signer - Ethers signer instance
 * @param {function} approveFunc - The approve function from erc20.js
 * @returns {Promise<object>} Transaction receipt
 */
export async function depositWithApprove(contractAddress: string, tokenAddress: any, amount: any, signer: ethers.Signer | ethers.providers.Provider | undefined, approveFunc: (arg0: any, arg1: any, arg2: any, arg3: any) => any) {
  // First approve
  await approveFunc(tokenAddress, contractAddress, amount, signer);

  // Then deposit
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const tx = await contract.deposit(amount);
  return await tx.wait();
}

/**
 * Swap with permit (single signature for approve + swap)
 * @param {string} contractAddress - SimpleStaking contract address
 * @param {string} tokenAddress - Token address to swap
 * @param {string} amount - Amount to swap (in wei)
 * @param {object} signer - Ethers signer instance
 * @returns {Promise<object>} Transaction receipt
 */
export async function swapWithPermit(contractAddress: string, tokenAddress: string, amount: ethers.BigNumberish, signer: ethers.Signer | ethers.providers.Provider | undefined) {
  const contract = new ethers.Contract(contractAddress, abi, signer);

  // Get permit signature (no transaction, just signature)
  const permitData = await getPermitSignature(tokenAddress, contractAddress, amount, signer as ethers.Signer);

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
