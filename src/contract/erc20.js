import { ethers } from 'ethers';
import erc20ABI from './erc20_ABI.json';

/**
 * Approve spender to spend tokens on behalf of the owner
 * @param {string} tokenAddress - ERC20 token contract address
 * @param {string} spenderAddress - Address to approve
 * @param {string} amount - Amount to approve (in wei or token's smallest unit)
 * @param {object} signer - Ethers signer instance
 * @returns {Promise<object>} Transaction receipt
 */
export async function approve(tokenAddress, spenderAddress, amount, signer) {
  const contract = new ethers.Contract(tokenAddress, erc20ABI, signer);
  const tx = await contract.approve(spenderAddress, amount);
  return await tx.wait();
}
