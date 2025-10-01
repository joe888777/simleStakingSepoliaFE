import { ethers } from 'ethers';
import simpleStakingABI from './SimpleStaking_ABI.json';

// Extract the ABI array from the metadata
const abi = JSON.parse(simpleStakingABI.metadata).output.abi;

/**
 * Deposit tokenB into the contract to provide swap liquidity
 * @param {string} contractAddress - SimpleStaking contract address
 * @param {string} amount - Amount to deposit (in wei)
 * @param {object} signer - Ethers signer instance
 * @returns {Promise<object>} Transaction receipt
 */
export async function deposit(contractAddress, amount, signer) {
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
export async function stake(contractAddress, amount, signer) {
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
export async function withdraw(contractAddress, amount, signer) {
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
export async function swap(contractAddress, amount, signer) {
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
export async function getTokenA(contractAddress, provider) {
  const contract = new ethers.Contract(contractAddress, abi, provider);
  return await contract.tokenA();
}

/**
 * Get tokenB address
 * @param {string} contractAddress - SimpleStaking contract address
 * @param {object} provider - Ethers provider instance
 * @returns {Promise<string>} TokenB address
 */
export async function getTokenB(contractAddress, provider) {
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
export async function getDepositedBalance(contractAddress, userAddress, provider) {
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
export async function getStakedBalance(contractAddress, userAddress, provider) {
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
export async function getTokenBalance(contractAddress, tokenAddress, provider) {
  const contract = new ethers.Contract(contractAddress, abi, provider);
  return await contract.getTokenBalance(tokenAddress);
}

/**
 * Get total staked amount
 * @param {string} contractAddress - SimpleStaking contract address
 * @param {object} provider - Ethers provider instance
 * @returns {Promise<string>} Total staked amount
 */
export async function getTotalStaked(contractAddress, provider) {
  const contract = new ethers.Contract(contractAddress, abi, provider);
  return await contract.totalStaked();
}

/**
 * Get total deposited amount
 * @param {string} contractAddress - SimpleStaking contract address
 * @param {object} provider - Ethers provider instance
 * @returns {Promise<string>} Total deposited amount
 */
export async function getTotalDeposited(contractAddress, provider) {
  const contract = new ethers.Contract(contractAddress, abi, provider);
  return await contract.totalDeposited();
}
